"use client";

import { useState } from "react";
import type { Dictionary } from "@/content/site";
import { Logo } from "./Logo";

export function Footer({ t }: { t: Dictionary["footer"] }) {
  const [done, setDone] = useState(false);
  return (
    <footer className="border-t bg-cream px-4 pb-10 pt-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-muted-foreground">{t.tagline}</p>
            <p className="mt-8 text-sm font-semibold text-ink">{t.newsletter}</p>
            {done ? (
              <p className="mt-3 text-sm text-sage">✓</p>
            ) : (
              <form
                className="mt-3 flex max-w-sm gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  className="min-w-0 flex-1 rounded-full border bg-card px-4 py-2.5 text-sm outline-none focus:border-terra"
                />
                <button className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink-soft">{t.subscribe}</button>
              </form>
            )}
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {t.columns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold uppercase tracking-wide text-ink">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-terra">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Fisicora. {t.rights}
          </p>
          <p>info@fisicora.com</p>
        </div>
      </div>
    </footer>
  );
}
