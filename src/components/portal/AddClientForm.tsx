"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { createClientAction, type FormState } from "@/app/actions";
import type { Portal } from "@/content/portal";

const field = "mt-1.5 w-full rounded-xl border bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-terra focus:bg-card";

export function AddClientForm({ lang, t }: { lang: string; t: Portal["clients"] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createClientAction, {});
  return (
    <form action={action} className="rounded-2xl border bg-card p-6">
      <input type="hidden" name="lang" value={lang} />
      <h2 className="flex items-center gap-2 text-xl font-semibold text-ink">
        <UserPlus className="h-5 w-5 text-terra" />
        {t.add}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm font-medium text-ink">
          {t.name} *
          <input name="name" required className={field} />
        </label>
        <label className="block text-sm font-medium text-ink">
          {t.email}
          <input name="email" type="email" className={field} />
        </label>
        <label className="block text-sm font-medium text-ink">
          {t.phone}
          <input name="phone" type="tel" className={field} />
        </label>
        <label className="block text-sm font-medium text-ink">
          {t.type}
          <select name="type" className={field} defaultValue="coach">
            <option value="coach">{t.types.coach}</option>
            <option value="nutrition">{t.types.nutrition}</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-ink">
          {t.phase}
          <select name="phase" className={field} defaultValue="maintenance">
            {Object.entries(t.phases).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-ink">
          {t.goal}
          <input name="goal" className={field} />
        </label>
      </div>
      {state.error === "nameRequired" && <p className="mt-3 text-sm font-medium text-red-600">{t.nameRequired}</p>}
      <button disabled={pending} className="mt-5 rounded-full bg-terra px-6 py-2.5 font-semibold text-white hover:bg-terra-dark disabled:opacity-60">
        {t.save}
      </button>
    </form>
  );
}
