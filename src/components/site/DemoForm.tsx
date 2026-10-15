"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Headset, Handshake } from "lucide-react";
import type { Dictionary } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const prefixes = ["+39", "+44", "+49", "+33", "+34", "+41", "+43", "+31", "+32", "+351", "+1"];
const perkIcons = [Clock, Headset, Handshake];

export function DemoForm({ t }: { t: Dictionary["demo"] }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const required = ["firstName", "lastName", "email", "phone", "role"];
    if (required.some((k) => !String(data[k] ?? "").trim()) || data.consent !== "on") {
      setState("error");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      form.reset();
      setState("done");
    } catch {
      setState("error");
    }
  }

  const input =
    "w-full rounded-xl border bg-cream px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-terra focus:bg-card";

  return (
    <section id="demo" className="bg-ink px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} light className="text-left lg:mx-0" />
          <Reveal className="mt-8 space-y-4">
            {t.perks.map((p, i) => {
              const Icon = perkIcons[i];
              return (
                <p key={p} className="flex items-center gap-3 text-cream">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream/10 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  {p}
                </p>
              );
            })}
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="rounded-[28px] bg-card p-6 shadow-2xl sm:p-8">
            {state === "done" ? (
              <div className="flex flex-col items-center py-12 text-center">
                <CheckCircle2 className="h-14 w-14 text-sage" />
                <p className="mt-4 text-xl font-semibold text-ink">{t.thanks}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-ink">
                    {t.firstName} *
                    <input name="firstName" autoComplete="given-name" className={`${input} mt-1.5`} />
                  </label>
                  <label className="block text-sm font-medium text-ink">
                    {t.lastName} *
                    <input name="lastName" autoComplete="family-name" className={`${input} mt-1.5`} />
                  </label>
                </div>
                <label className="block text-sm font-medium text-ink">
                  {t.email} *
                  <input name="email" type="email" autoComplete="email" className={`${input} mt-1.5`} />
                </label>
                <label className="block text-sm font-medium text-ink">
                  {t.phone} *
                  <div className="mt-1.5 flex gap-2">
                    <select name="prefix" className={`${input} w-28`} defaultValue="+39">
                      {prefixes.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                    <input name="phone" type="tel" autoComplete="tel-national" className={input} />
                  </div>
                </label>
                <label className="block text-sm font-medium text-ink">
                  {t.role} *
                  <select name="role" defaultValue="" className={`${input} mt-1.5`}>
                    <option value="" disabled>
                      ...
                    </option>
                    {t.roles.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-start gap-3 text-sm text-muted-foreground">
                  <input name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-[var(--terra)]" />
                  {t.consent}
                </label>
                {state === "error" && <p className="text-sm font-medium text-terra">{t.error}</p>}
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="w-full rounded-full bg-terra px-6 py-3.5 font-semibold text-white transition-colors hover:bg-terra-dark disabled:opacity-60"
                >
                  {state === "sending" ? t.sending : t.submit}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
