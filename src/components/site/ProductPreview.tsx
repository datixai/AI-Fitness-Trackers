import { Mic, Sparkles } from "lucide-react";
import type { Dictionary, Locale } from "@/content/site";
import { Reveal } from "./Reveal";

const labels = {
  en: {
    tabs: ["Overview", "Check-ins", "Nutrition", "Training", "Invoices"],
    phase: "Phase: Cut, week 6",
    weight: "Weight",
    kcal: "Daily target",
    adherence: "Adherence",
    steps: "Avg steps",
    summary: "AI summary of this week",
    summaryText:
      "Weight down 0.6 kg, hunger rising in the evening, sleep 6.4 h. Suggest moving 20 g carbs to dinner and a diet break in week 8.",
    recording: "Recording check-in",
    macros: "Macros",
  },
  it: {
    tabs: ["Riepilogo", "Check-in", "Nutrizione", "Allenamento", "Fatture"],
    phase: "Fase: Definizione, settimana 6",
    weight: "Peso",
    kcal: "Obiettivo giornaliero",
    adherence: "Aderenza",
    steps: "Passi medi",
    summary: "Riepilogo AI della settimana",
    summaryText:
      "Peso giù di 0,6 kg, fame in aumento la sera, sonno 6,4 h. Suggerisco di spostare 20 g di carboidrati a cena e un diet break alla settimana 8.",
    recording: "Registrazione check-in",
    macros: "Macro",
  },
};

const weights = [84.2, 83.9, 83.7, 83.8, 83.3, 83.0, 82.8, 82.5, 82.6, 82.1, 81.9, 81.6];

export function ProductPreview({ t, lang }: { t: Dictionary["preview"]; lang: Locale }) {
  const l = labels[lang];
  const max = Math.max(...weights);
  const min = Math.min(...weights);
  const points = weights
    .map((w, i) => `${(i / (weights.length - 1)) * 300},${8 + ((max - w) / (max - min)) * 84}`)
    .join(" ");

  return (
    <section className="relative px-4 pb-20 sm:px-6 lg:pb-28">
      <Reveal className="mx-auto max-w-6xl">
        <div className="float-slow rounded-[28px] border bg-card p-2 shadow-[0_40px_80px_-40px_rgb(20_33_61/0.35)] sm:p-3">
          <div className="overflow-hidden rounded-[22px] border bg-cream">
            {/* window bar */}
            <div className="flex items-center gap-2 border-b bg-card px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#b7d9d3]" />
              <span className="h-3 w-3 rounded-full bg-[#f3d59a]" />
              <span className="h-3 w-3 rounded-full bg-[#b9d4c2]" />
              <span className="ml-3 hidden rounded-md bg-sand px-3 py-1 text-xs text-muted-foreground sm:inline">app.fisicora.com/clients/giulia-rossi</span>
            </div>

            <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                {/* client header */}
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terra-soft font-display text-xl font-semibold text-terra">GR</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl font-semibold text-ink">Giulia Rossi</p>
                    <p className="text-sm text-muted-foreground">{l.phase}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-terra px-4 py-2 text-sm font-semibold text-white">
                    <span className="pulse-ring flex h-2 w-2 rounded-full bg-white" />
                    <Mic className="h-4 w-4" />
                    <span className="hidden sm:inline">{l.recording}</span> 02:14
                  </span>
                </div>

                <div className="flex gap-1 overflow-x-auto rounded-xl bg-sand p-1 text-sm">
                  {l.tabs.map((tab, i) => (
                    <span key={tab} className={i === 0 ? "whitespace-nowrap rounded-lg bg-card px-4 py-1.5 font-medium text-ink shadow-sm" : "whitespace-nowrap px-4 py-1.5 text-muted-foreground"}>
                      {tab}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { k: l.weight, v: "81.6 kg", c: "text-sage", d: "-2.6 kg" },
                    { k: l.kcal, v: "2,050 kcal", c: "text-muted-foreground", d: "P 180 C 190 F 62" },
                    { k: l.adherence, v: "92%", c: "text-sage", d: "+4%" },
                    { k: l.steps, v: "10,840", c: "text-muted-foreground", d: "7 d" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-2xl border bg-card p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.k}</p>
                      <p className="mt-1 text-lg font-semibold text-ink">{s.v}</p>
                      <p className={`text-xs ${s.c}`}>{s.d}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border bg-card p-4">
                  <svg viewBox="0 0 300 100" className="h-32 w-full" preserveAspectRatio="none" aria-hidden>
                    <defs>
                      <linearGradient id="wfill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--terra)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--terra)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon points={`0,100 ${points} 300,100`} fill="url(#wfill)" />
                    <polyline points={points} fill="none" stroke="var(--terra)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border bg-ink p-5 text-cream">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-gold" />
                    {l.summary}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-cream/80">{l.summaryText}</p>
                  <div className="mt-4 flex h-8 items-center gap-1">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <span key={i} className="wave-bar w-1 rounded-full bg-terra" style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 7) * 0.1}s` }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <p className="text-sm font-semibold text-ink">{l.macros}</p>
                  {[
                    { k: "Protein", v: 180, max: 200, c: "bg-terra" },
                    { k: "Carbs", v: 190, max: 260, c: "bg-gold" },
                    { k: "Fat", v: 62, max: 80, c: "bg-sage" },
                  ].map((m) => (
                    <div key={m.k} className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{m.k}</span>
                        <span>{m.v} g</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-sand">
                        <div className={`h-2 rounded-full ${m.c}`} style={{ width: `${(m.v / m.max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mx-auto mt-14 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-ink sm:text-4xl">{t.title}</h2>
        <p className="mt-3 text-lg text-muted-foreground">{t.subtitle}</p>
      </Reveal>
    </section>
  );
}
