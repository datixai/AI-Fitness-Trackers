"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Dictionary, Locale } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export function Navbar({ t, lang }: { t: Dictionary["nav"]; lang: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#how", label: t.how },
    { href: "#features", label: t.features },
    { href: "#who", label: t.who },
    { href: "#pricing", label: t.pricing },
    { href: "#faq", label: t.faq },
  ];
  const other: Locale = lang === "en" ? "it" : "en";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open ? "border-b bg-cream/90 shadow-[0_6px_24px_-12px_rgb(20_33_61/0.18)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={`/${lang}`} aria-label="Fisicora home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-7 text-[15px] text-ink-soft lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-terra">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={`/${other}`}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            {other}
          </Link>
          <Link href={`/${lang}/app`} className="px-2 text-[15px] font-medium text-ink transition-colors hover:text-terra">
            {t.app}
          </Link>
          <Link href={`/${lang}/login`} className="px-2 text-[15px] font-medium text-ink transition-colors hover:text-terra">
            {t.login}
          </Link>
          <a
            href="#demo"
            className="rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-cream transition-all hover:-translate-y-0.5 hover:bg-ink-soft"
          >
            {t.demo}
          </a>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-ink lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t bg-cream px-4 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <Link href={`/${other}`} className="rounded-full border px-4 py-2 text-sm font-semibold uppercase text-ink">
              {other}
            </Link>
            <Link href={`/${lang}/app`} className="rounded-full border px-4 py-2 text-sm font-semibold text-ink">
              {t.app}
            </Link>
            <Link href={`/${lang}/login`} className="rounded-full border px-4 py-2 text-sm font-semibold text-ink">
              {t.login}
            </Link>
            <a href="#demo" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-cream">
              {t.demo}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
