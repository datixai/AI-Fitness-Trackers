"use client";

import { useState } from "react";
import { CalendarDays, Check, ClipboardCheck, Dumbbell, Receipt, Salad } from "lucide-react";
import type { Dictionary, Locale } from "@/content/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const L = {
  en: {
    meals: [
      ["Breakfast", "Greek yogurt, oats, berries", 520],
      ["Lunch", "Chicken, basmati rice, courgettes", 640],
      ["Snack", "Ricotta, rice cakes, honey", 310],
      ["Dinner", "Sea bass, potatoes, salad, olive oil", 580],
    ],
    total: "Total",
    session: "Legs A · Week 3",
    exercises: ["Back squat", "Romanian deadlift", "Leg press", "Seated leg curl"],
    checks: ["Weight", "Sleep", "Hunger", "Steps"],
    flag: "Flag: evening hunger up for 3 check-ins in a row.",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    invoices: ["Pro coaching, 3 months", "Nutrition visit", "Peak week package"],
    paid: "Paid",
    due: "Due",
  },
  it: {
    meals: [
      ["Colazione", "Yogurt greco, avena, frutti di bosco", 520],
      ["Pranzo", "Pollo, riso basmati, zucchine", 640],
      ["Spuntino", "Ricotta, gallette di riso, miele", 310],
      ["Cena", "Branzino, patate, insalata, olio EVO", 580],
    ],
    total: "Totale",
    session: "Gambe A · Settimana 3",
    exercises: ["Squat", "Stacco rumeno", "Leg press", "Leg curl seduto"],
    checks: ["Peso", "Sonno", "Fame", "Passi"],
    flag: "Avviso: fame serale in aumento da 3 check-in.",
    days: ["Lun", "Mar", "Mer", "Gio", "Ven"],
    invoices: ["Coaching Pro, 3 mesi", "Visita nutrizionale", "Pacchetto peak week"],
    paid: "Pagata",
    due: "Da pagare",
  },
} as const;

const icons = { nutrition: Salad, training: Dumbbell, checkins: ClipboardCheck, calendar: CalendarDays, billing: Receipt } as const;

function Visual({ tabKey, lang }: { tabKey: string; lang: Locale }) {
  const l = L[lang];
  if (tabKey === "nutrition") {
    const meals = l.meals;
    return (
      <div className="space-y-3">
        {meals.map(([m, food, kcal]) => (
          <div key={m} className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-terra">{m}</p>
              <p className="text-sm text-ink">{food}</p>
            </div>
            <span className="text-sm font-semibold text-ink">{kcal} kcal</span>
          </div>
        ))}
        <div className="rounded-2xl bg-ink px-4 py-3 text-sm text-cream">{l.total} 2,050 kcal · P 180 g · C 190 g · F 62 g</div>
      </div>
    );
  }
  if (tabKey === "training") {
    const rows = [
      [l.exercises[0], "4 x 6", "RIR 2", "120 kg"],
      [l.exercises[1], "3 x 8", "RIR 2", "100 kg"],
      [l.exercises[2], "3 x 12", "RIR 1", "220 kg"],
      [l.exercises[3], "3 x 12", "RIR 1", "55 kg"],
    ];
    return (
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="bg-sand px-4 py-2 text-sm font-semibold text-ink">{l.session}</div>
        {rows.map((r) => (
          <div key={r[0]} className="grid grid-cols-4 border-t px-4 py-3 text-sm">
            <span className="col-span-1 font-medium text-ink">{r[0]}</span>
            <span className="text-muted-foreground">{r[1]}</span>
            <span className="text-muted-foreground">{r[2]}</span>
            <span className="text-right font-semibold text-sage">{r[3]}</span>
          </div>
        ))}
      </div>
    );
  }
  if (tabKey === "checkins") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          [l.checks[0], "81.6 kg", "-0.6"],
          [l.checks[1], "6.4 h", "-0.3"],
          [l.checks[2], "7/10", "+2"],
          [l.checks[3], "10,840", "+900"],
        ].map(([k, v, d]) => (
          <div key={k} className="rounded-2xl border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{k}</p>
            <p className="mt-1 text-xl font-semibold text-ink">{v}</p>
            <p className="text-xs text-terra">{d}</p>
          </div>
        ))}
        <div className="col-span-2 rounded-2xl bg-terra-soft p-4 text-sm text-terra-dark">{l.flag}</div>
      </div>
    );
  }
  if (tabKey === "calendar") {
    const days = l.days;
    return (
      <div className="grid grid-cols-5 gap-2">
        {days.map((d, i) => (
          <div key={d} className="space-y-2">
            <p className="text-center text-xs font-semibold text-muted-foreground">{d}</p>
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className={cn(
                  "h-12 rounded-xl border",
                  (i + j) % 3 === 0 ? "border-terra/30 bg-terra-soft" : (i + j) % 3 === 1 ? "border-sage/30 bg-sage-soft" : "bg-card",
                )}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {[
        ["INV-2026-041", l.invoices[0], "€ 360", l.paid],
        ["INV-2026-042", l.invoices[1], "€ 80", l.paid],
        ["INV-2026-043", l.invoices[2], "€ 150", l.due],
      ].map(([n, d, a, s]) => (
        <div key={n} className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3 text-sm">
          <div>
            <p className="font-medium text-ink">{d}</p>
            <p className="text-xs text-muted-foreground">{n}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-ink">{a}</p>
            <p className={cn("text-xs", s === l.paid ? "text-sage" : "text-terra")}>{s}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FeatureTabs({ t, lang }: { t: Dictionary["features"]; lang: Locale }) {
  const [active, setActive] = useState(0);
  const tab = t.tabs[active];

  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <Reveal className="mt-12">
          <div role="tablist" className="mx-auto flex max-w-full gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center">
            {t.tabs.map((item, i) => {
              const Icon = icons[item.key as keyof typeof icons];
              return (
                <button
                  key={item.key}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
                    i === active ? "border-ink bg-ink text-cream" : "bg-card text-ink-soft hover:border-ink/40",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div key={tab.key} className="mt-10 grid items-center gap-10 rounded-[32px] border bg-sand/60 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 sm:p-10 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-semibold text-ink">{tab.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{tab.text}</p>
              <ul className="mt-6 space-y-3">
                {tab.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-ink">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
                      <Check className="h-4 w-4" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-cream p-4 shadow-[0_24px_50px_-30px_rgb(20_33_61/0.4)] sm:p-6">
              <Visual tabKey={tab.key} lang={lang} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
