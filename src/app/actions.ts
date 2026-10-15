"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSession, destroySession, getUser } from "@/lib/session";
import { isLocale } from "@/content/site";

export type FormState = { error?: "invalid" | "tooMany" | "nameRequired"; ok?: boolean; email?: string };

const attempts = new Map<string, { count: number; first: number }>();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 8;

function tooManyAttempts(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.first > WINDOW) {
    attempts.set(key, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

function lang(value: FormDataEntryValue | null) {
  const l = String(value ?? "en");
  return isLocale(l) ? l : "en";
}

function text(value: FormDataEntryValue | null, max = 500) {
  const s = String(value ?? "").trim().slice(0, max);
  return s.length ? s : null;
}

function num(value: FormDataEntryValue | null) {
  const n = parseFloat(String(value ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const l = lang(formData.get("lang"));
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "invalid", email };
  if (tooManyAttempts(email)) return { error: "tooMany", email };

  const user = await db.user.findUnique({ where: { email } });
  // Compare against a dummy hash when the user is unknown, to keep timing similar.
  const hash = user?.passwordHash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi";
  const valid = await bcrypt.compare(password, hash);
  if (!user || !valid) return { error: "invalid", email };

  attempts.delete(email);
  await createSession(user.id);
  redirect(`/${l}/clients`);
}

export async function logoutAction(formData: FormData) {
  const l = lang(formData.get("lang"));
  await destroySession();
  redirect(`/${l}/login`);
}

export async function createClientAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getUser();
  if (!user) return { error: "invalid" };
  const l = lang(formData.get("lang"));
  const name = text(formData.get("name"), 120);
  if (!name) return { error: "nameRequired" };

  const type = formData.get("type") === "nutrition" ? "nutrition" : "coach";
  const phases = ["cut", "offseason", "dietBreak", "maintenance"];
  const phaseValue = String(formData.get("phase"));
  const client = await db.client.create({
    data: {
      ownerId: user.id,
      name,
      email: text(formData.get("email"), 160),
      phone: text(formData.get("phone"), 40),
      goal: text(formData.get("goal")),
      type,
      phase: phases.includes(phaseValue) ? phaseValue : "maintenance",
    },
  });
  revalidatePath(`/${l}/clients`);
  redirect(`/${l}/clients/${client.id}`);
}

async function ownedClient(id: string, userId: string) {
  return db.client.findFirst({ where: { id, ownerId: userId } });
}

export async function updateClientAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getUser();
  if (!user) return { error: "invalid" };
  const id = String(formData.get("id"));
  if (!(await ownedClient(id, user.id))) return { error: "invalid" };
  await db.client.update({
    where: { id },
    data: {
      goal: text(formData.get("goal")),
      allergies: text(formData.get("allergies")),
      notes: text(formData.get("notes"), 4000),
    },
  });
  revalidatePath(`/${lang(formData.get("lang"))}/clients/${id}`);
  return { ok: true };
}

export async function addMeasurementAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getUser();
  if (!user) return { error: "invalid" };
  const id = String(formData.get("id"));
  if (!(await ownedClient(id, user.id))) return { error: "invalid" };
  const weightKg = num(formData.get("weightKg"));
  const bodyFat = num(formData.get("bodyFat"));
  const waistCm = num(formData.get("waistCm"));
  if (weightKg === null && bodyFat === null && waistCm === null) return { error: "invalid" };
  const dateValue = String(formData.get("date") ?? "");
  const date = dateValue ? new Date(dateValue) : new Date();
  await db.measurement.create({
    data: {
      clientId: id,
      date: Number.isNaN(date.getTime()) ? new Date() : date,
      weightKg: weightKg !== null && weightKg > 20 && weightKg < 400 ? weightKg : null,
      bodyFat: bodyFat !== null && bodyFat > 1 && bodyFat < 70 ? bodyFat : null,
      waistCm: waistCm !== null && waistCm > 30 && waistCm < 250 ? waistCm : null,
    },
  });
  revalidatePath(`/${lang(formData.get("lang"))}/clients/${id}`);
  return { ok: true };
}

export async function archiveClientAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const id = String(formData.get("id"));
  const l = lang(formData.get("lang"));
  if (!(await ownedClient(id, user.id))) return;
  await db.client.update({ where: { id }, data: { archived: true } });
  revalidatePath(`/${l}/clients`);
  redirect(`/${l}/clients`);
}
