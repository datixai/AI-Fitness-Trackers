"use client";

import { useActionState } from "react";
import { addMeasurementAction, updateClientAction, type FormState } from "@/app/actions";
import type { Portal } from "@/content/portal";

const field = "mt-1.5 w-full rounded-xl border bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-terra focus:bg-card";

export function EditClientForm({
  id,
  lang,
  t,
  initial,
}: {
  id: string;
  lang: string;
  t: Portal["record"];
  initial: { goal: string | null; allergies: string | null; notes: string | null };
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateClientAction, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="lang" value={lang} />
      <label className="block text-sm font-medium text-ink">
        {t.goal}
        <input name="goal" defaultValue={initial.goal ?? ""} className={field} />
      </label>
      <label className="block text-sm font-medium text-ink">
        {t.allergies}
        <input name="allergies" defaultValue={initial.allergies ?? ""} className={field} />
      </label>
      <label className="block text-sm font-medium text-ink">
        {t.notes}
        <textarea name="notes" rows={5} defaultValue={initial.notes ?? ""} className={field} />
      </label>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink-soft disabled:opacity-60">
          {t.edit}
        </button>
        {state.ok && <span className="text-sm font-medium text-sage">{t.saved}</span>}
      </div>
    </form>
  );
}

export function AddMeasurementForm({ id, lang, t }: { id: string; lang: string; t: Portal["record"] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addMeasurementAction, {});
  const today = new Date().toISOString().slice(0, 10);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="lang" value={lang} />
      <p className="font-semibold text-ink">{t.addMeasure}</p>
      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 block text-sm text-muted-foreground">
          {t.date}
          <input name="date" type="date" defaultValue={today} className={field} />
        </label>
        <label className="block text-sm text-muted-foreground">
          {t.weight}
          <input name="weightKg" inputMode="decimal" className={field} />
        </label>
        <label className="block text-sm text-muted-foreground">
          {t.bodyFat}
          <input name="bodyFat" inputMode="decimal" className={field} />
        </label>
        <label className="col-span-2 block text-sm text-muted-foreground">
          {t.waist}
          <input name="waistCm" inputMode="decimal" className={field} />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="rounded-full bg-terra px-5 py-2.5 text-sm font-semibold text-white hover:bg-terra-dark disabled:opacity-60">
          {t.addMeasure}
        </button>
        {state.ok && <span className="text-sm font-medium text-sage">{t.saved}</span>}
      </div>
    </form>
  );
}
