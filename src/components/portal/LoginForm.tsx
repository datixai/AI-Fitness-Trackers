"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/actions";
import type { Portal } from "@/content/portal";

const field =
  "mt-1.5 w-full rounded-xl border bg-cream px-4 py-3 text-ink outline-none transition-colors focus:border-terra focus:bg-card";

export function LoginForm({ lang, t }: { lang: string; t: Portal["login"] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="lang" value={lang} />
      <label className="block text-sm font-medium text-ink">
        {t.email}
        <input name="email" type="email" autoComplete="email" required defaultValue={state.email ?? ""} className={field} />
      </label>
      <label className="block text-sm font-medium text-ink">
        {t.password}
        <input name="password" type="password" autoComplete="current-password" required className={field} />
      </label>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error === "tooMany" ? t.tooMany : t.invalid}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-terra px-6 py-3.5 font-semibold text-white transition-colors hover:bg-terra-dark disabled:opacity-60"
      >
        {pending ? t.busy : t.submit}
      </button>
    </form>
  );
}
