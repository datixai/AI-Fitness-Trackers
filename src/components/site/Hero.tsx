import Link from "next/link";
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import type { Dictionary, Locale } from "@/content/site";
import { Reveal } from "./Reveal";

export function Hero({ t, lang }: { t: Dictionary["hero"]; lang: Locale }) {
  return (
    <section className="relative overflow-hidden pb-10 pt-32 lg:pb-16 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-terra-soft/70 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-40 h-80 w-80 rounded-full bg-sage-soft blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-1.5 text-sm text-ink-soft shadow-sm">
            <Sparkles className="h-4 w-4 text-terra" />
            {t.badge}
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 text-[42px] font-semibold leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
            {t.title1}
            <br />
            <span className="italic text-terra">{t.title2}</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{t.subtitle}</p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 rounded-full bg-terra px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgb(13_143_130/0.7)] transition-all hover:-translate-y-0.5 hover:bg-terra-dark"
            >
              {t.primary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              href={`/${lang}/app`}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-7 py-3.5 text-base font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-ink"
            >
              <PlayCircle className="h-5 w-5 text-terra" />
              {t.secondary}
            </Link>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-sage" />
            {t.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
