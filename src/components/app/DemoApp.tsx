"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  FileText,
  Home,
  LineChart,
  Loader2,
  Mic,
  Receipt,
  Salad,
  Search,
  Sparkles,
  Square,
  Users,
} from "lucide-react";
import type { Locale } from "@/content/site";
import { checkins, clients, maintenanceKcal, phaseFactor, transcript, type Client, type Phase } from "@/content/demo";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/site/Logo";

const T = {
  en: {
    back: "Back to website",
    demoBadge: "Demo with sample data",
    nav: { dashboard: "Dashboard", clients: "Clients", calendar: "Calendar", billing: "Billing" },
    search: "Search clients",
    phases: { cut: "Cut", offseason: "Offseason", dietBreak: "Diet break", maintenance: "Maintenance" } as Record<Phase, string>,
    week: "week",
    tabs: { overview: "Overview", measures: "Measurements", nutrition: "Nutrition", training: "Training", diary: "Check-ins" },
    goal: "Goal",
    allergies: "Allergies",
    notes: "Coach notes",
    nextVisit: "Next visit",
    adherence: "Adherence",
    weight: "Weight",
    bodyFat: "Body fat",
    waist: "Waist",
    session: "AI session",
    sessionHint: "Record a check-in or consultation. Fisicora transcribes and writes the summary for you.",
    start: "Start session",
    stop: "Stop and summarise",
    analysing: "Analysing conversation...",
    summary: "AI summary",
    summaryItems: [
      ["Hunger", "High after 21:00, 3 weeks in a row"],
      ["Sleep", "About 6 h, below target of 7 h"],
      ["Training", "Performance stable, no pain reported"],
      ["Food swap", "Rice instead of potatoes at lunch"],
      ["Suggestion", "Move 20 g carbs to dinner, add volume foods, plan a diet break in week 8"],
    ],
    draftPlan: "Create meal plan draft",
    you: "Coach",
    client: "Client",
    trend: "Weight trend, last 12 check-ins",
    addEntry: "Add measurement",
    save: "Save",
    target: "Daily target",
    macros: "Macros",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    aiDraft: "AI draft, review before sending",
    exportPdf: "Export PDF",
    meals: [
      { name: "Breakfast", items: "Greek yogurt 250 g, oats 50 g, berries 100 g", share: 0.24 },
      { name: "Lunch", items: "Chicken breast 150 g, basmati rice 80 g, courgettes", share: 0.31 },
      { name: "Snack", items: "Rice cakes 4, honey 15 g, whey 30 g", share: 0.15 },
      { name: "Dinner", items: "Sea bass 200 g, potatoes 250 g, salad, olive oil 10 g", share: 0.3 },
    ],
    split: "Upper lower split, 5 days",
    days: ["Upper A", "Lower A", "Rest", "Upper B", "Lower B", "Steps 12k", "Rest"],
    exercises: [
      ["Incline dumbbell press", "4 x 8", "RIR 2"],
      ["Chest supported row", "4 x 10", "RIR 2"],
      ["Seated shoulder press", "3 x 10", "RIR 1"],
      ["Lat pulldown", "3 x 12", "RIR 1"],
      ["Cable lateral raise", "3 x 15", "RIR 0"],
    ],
    aiProgress: "AI suggests +2.5 kg on incline press next session (RIR stayed at 3).",
    diaryCols: ["Date", "Weight", "Steps", "Sleep", "Hunger", "Energy"],
    weekly: "AI weekly summary",
    weeklyText: "Down 0.9 kg this week, on track for stage date. Hunger trending up and sleep under 6.5 h: worth addressing before adding cardio.",
    dashTitle: "Good morning, Coach",
    today: "Today",
    flags: "Needs your attention",
    stats: ["Active clients", "Check-ins this week", "Hours saved by AI", "Revenue this month"],
    open: "Open",
    calendarSoon: "Calendar, booking and reminders are part of the full version.",
    billingSoon: "Invoices and online payments are part of the full version.",
    flagText: { giulia: "Evening hunger rising", luca: "Low energy, diet break active" } as Record<string, string>,
    types: { coach: "Coaching", nutrition: "Nutrition" },
  },
  it: {
    back: "Torna al sito",
    demoBadge: "Demo con dati di esempio",
    nav: { dashboard: "Dashboard", clients: "Clienti", calendar: "Agenda", billing: "Fatture" },
    search: "Cerca clienti",
    phases: { cut: "Definizione", offseason: "Offseason", dietBreak: "Diet break", maintenance: "Mantenimento" } as Record<Phase, string>,
    week: "settimana",
    tabs: { overview: "Riepilogo", measures: "Misure", nutrition: "Nutrizione", training: "Allenamento", diary: "Check-in" },
    goal: "Obiettivo",
    allergies: "Allergie",
    notes: "Note del coach",
    nextVisit: "Prossima visita",
    adherence: "Aderenza",
    weight: "Peso",
    bodyFat: "Massa grassa",
    waist: "Vita",
    session: "Sessione AI",
    sessionHint: "Registra un check-in o una visita. Fisicora trascrive e scrive il riepilogo per te.",
    start: "Avvia sessione",
    stop: "Ferma e riassumi",
    analysing: "Analisi della conversazione...",
    summary: "Riepilogo AI",
    summaryItems: [
      ["Fame", "Alta dopo le 21:00, da 3 settimane"],
      ["Sonno", "Circa 6 h, sotto l'obiettivo di 7 h"],
      ["Allenamento", "Prestazioni stabili, nessun dolore"],
      ["Sostituzione", "Riso al posto delle patate a pranzo"],
      ["Suggerimento", "Spostare 20 g di carboidrati a cena, più alimenti voluminosi, diet break alla settimana 8"],
    ],
    draftPlan: "Crea bozza del piano",
    you: "Coach",
    client: "Cliente",
    trend: "Andamento del peso, ultimi 12 check-in",
    addEntry: "Aggiungi misura",
    save: "Salva",
    target: "Obiettivo giornaliero",
    macros: "Macro",
    protein: "Proteine",
    carbs: "Carboidrati",
    fat: "Grassi",
    aiDraft: "Bozza AI, da controllare prima dell'invio",
    exportPdf: "Esporta PDF",
    meals: [
      { name: "Colazione", items: "Yogurt greco 250 g, avena 50 g, frutti di bosco 100 g", share: 0.24 },
      { name: "Pranzo", items: "Petto di pollo 150 g, riso basmati 80 g, zucchine", share: 0.31 },
      { name: "Spuntino", items: "4 gallette di riso, miele 15 g, whey 30 g", share: 0.15 },
      { name: "Cena", items: "Branzino 200 g, patate 250 g, insalata, olio EVO 10 g", share: 0.3 },
    ],
    split: "Split upper lower, 5 giorni",
    days: ["Upper A", "Lower A", "Riposo", "Upper B", "Lower B", "12k passi", "Riposo"],
    exercises: [
      ["Panca inclinata manubri", "4 x 8", "RIR 2"],
      ["Rematore con supporto", "4 x 10", "RIR 2"],
      ["Lento avanti seduto", "3 x 10", "RIR 1"],
      ["Lat machine", "3 x 12", "RIR 1"],
      ["Alzate laterali ai cavi", "3 x 15", "RIR 0"],
    ],
    aiProgress: "L'AI suggerisce +2,5 kg sulla panca inclinata alla prossima sessione (RIR rimasto a 3).",
    diaryCols: ["Data", "Peso", "Passi", "Sonno", "Fame", "Energia"],
    weekly: "Riepilogo settimanale AI",
    weeklyText: "-0,9 kg questa settimana, in linea con la data della gara. Fame in aumento e sonno sotto le 6,5 h: da gestire prima di aggiungere cardio.",
    dashTitle: "Buongiorno, Coach",
    today: "Oggi",
    flags: "Da controllare",
    stats: ["Clienti attivi", "Check-in questa settimana", "Ore risparmiate con l'AI", "Incassi del mese"],
    open: "Apri",
    calendarSoon: "Agenda, prenotazioni e promemoria fanno parte della versione completa.",
    billingSoon: "Fatture e pagamenti online fanno parte della versione completa.",
    flagText: { giulia: "Fame serale in aumento", luca: "Energia bassa, diet break attivo" } as Record<string, string>,
    types: { coach: "Coaching", nutrition: "Nutrizione" },
  },
};

type Strings = (typeof T)["en"];
type View = "dashboard" | "clients" | "calendar" | "billing";
type Tab = keyof Strings["tabs"];

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border bg-card p-5", className)}>{children}</div>;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="text-xs text-sage">{sub}</p>}
    </Card>
  );
}

function WeightChart({ data }: { data: number[] }) {
  const max = Math.max(...data) + 0.3;
  const min = Math.min(...data) - 0.3;
  const pts = data.map((w, i) => [(i / (data.length - 1)) * 600, 10 + ((max - w) / (max - min)) * 160] as const);
  const line = pts.map((p) => p.join(",")).join(" ");
  return (
    <svg viewBox="0 0 600 190" className="h-48 w-full" preserveAspectRatio="none" role="img" aria-label="weight chart">
      <defs>
        <linearGradient id="appfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--terra)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--terra)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2="600" y1={10 + i * 53} y2={10 + i * 53} stroke="var(--border)" vectorEffect="non-scaling-stroke" />
      ))}
      <polygon points={`0,190 ${line} 600,190`} fill="url(#appfill)" />
      <polyline points={line} fill="none" stroke="var(--terra)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Recorder({ s, lang, onDraft }: { s: Strings; lang: Locale; onDraft: () => void }) {
  const [mode, setMode] = useState<"idle" | "rec" | "busy" | "done">("idle");
  const [seconds, setSeconds] = useState(0);
  const [lines, setLines] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const script = transcript[lang];

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  function start() {
    setMode("rec");
    setSeconds(0);
    setLines(0);
    timer.current = setInterval(() => {
      setSeconds((v) => v + 1);
      setLines((v) => Math.min(v + 0.5, script.length));
    }, 1000);
  }

  function stop() {
    if (timer.current) clearInterval(timer.current);
    setLines(script.length);
    setMode("busy");
    setTimeout(() => setMode("done"), 1600);
  }

  const shown = script.slice(0, Math.floor(lines));
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <Card className="lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Mic className="h-4 w-4 text-terra" />
            {s.session}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{s.sessionHint}</p>
        </div>
        {mode === "rec" ? (
          <button onClick={stop} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream">
            <span className="pulse-ring h-2.5 w-2.5 rounded-full bg-terra" />
            {mm}:{ss}
            <Square className="h-4 w-4" />
            <span className="hidden sm:inline">{s.stop}</span>
          </button>
        ) : (
          <button
            onClick={start}
            disabled={mode === "busy"}
            className="inline-flex items-center gap-2 rounded-full bg-terra px-5 py-2.5 text-sm font-semibold text-white hover:bg-terra-dark disabled:opacity-60"
          >
            <Mic className="h-4 w-4" />
            {s.start}
          </button>
        )}
      </div>

      {mode !== "idle" && (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 rounded-xl bg-sand/60 p-4">
            {shown.map(([who, text], i) => (
              <p key={i} className="text-sm animate-in fade-in slide-in-from-bottom-1">
                <span className={cn("mr-2 text-xs font-semibold uppercase", who === "coach" ? "text-terra" : "text-sage")}>
                  {who === "coach" ? s.you : s.client}
                </span>
                <span className="text-ink">{text}</span>
              </p>
            ))}
            {mode === "rec" && (
              <div className="flex h-6 items-center gap-1 pt-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className="wave-bar h-full w-1 rounded-full bg-terra/70" style={{ animationDelay: `${(i % 6) * 0.12}s` }} />
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl bg-ink p-4 text-cream">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-gold" />
              {s.summary}
            </p>
            {mode === "rec" && <p className="mt-3 text-sm text-cream/60">...</p>}
            {mode === "busy" && (
              <p className="mt-3 flex items-center gap-2 text-sm text-cream/80">
                <Loader2 className="h-4 w-4 animate-spin" />
                {s.analysing}
              </p>
            )}
            {mode === "done" && (
              <div className="animate-in fade-in">
                <dl className="mt-3 space-y-2 text-sm">
                  {s.summaryItems.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs uppercase tracking-wide text-gold">{k}</dt>
                      <dd className="text-cream/90">{v}</dd>
                    </div>
                  ))}
                </dl>
                <button onClick={onDraft} className="mt-4 w-full rounded-full bg-terra px-4 py-2 text-sm font-semibold text-white hover:bg-terra-dark">
                  {s.draftPlan}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

function ClientRecord({ client, s, lang }: { client: Client; s: Strings; lang: Locale }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [phase, setPhase] = useState<Phase>(client.phase);
  const [weights, setWeights] = useState(client.weights);
  const [newWeight, setNewWeight] = useState("");
  const [draft, setDraft] = useState(false);

  const kcal = Math.round((maintenanceKcal[client.id] * phaseFactor[phase]) / 10) * 10;
  const lastWeight = weights[weights.length - 1];
  const protein = Math.round(lastWeight * 2.2);
  const fat = Math.round((kcal * 0.25) / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const delta = (lastWeight - weights[0]).toFixed(1);

  const tabIcons: Record<Tab, typeof Home> = { overview: Home, measures: LineChart, nutrition: Salad, training: Dumbbell, diary: ClipboardList };

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terra-soft font-display text-2xl font-semibold text-terra">{client.initials}</div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold text-ink">{client.name}</h2>
          <p className="text-sm text-muted-foreground">
            {client.age} · {client.email} · {client.phone}
          </p>
        </div>
        <label className="text-sm text-muted-foreground">
          <span className="sr-only">Phase</span>
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value as Phase)}
            className="rounded-full border bg-sand px-4 py-2 font-semibold text-ink outline-none focus:border-terra"
          >
            {(Object.keys(s.phases) as Phase[]).map((p) => (
              <option key={p} value={p}>
                {s.phases[p]}
              </option>
            ))}
          </select>
        </label>
      </Card>

      <div className="flex gap-1 overflow-x-auto rounded-xl bg-sand p-1">
        {(Object.keys(s.tabs) as Tab[]).map((k) => {
          const Icon = tabIcons[k];
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                tab === k ? "bg-card text-ink shadow-sm" : "text-muted-foreground hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" />
              {s.tabs[k]}
            </button>
          );
        })}
      </div>

      {tab === "overview" && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Stat label={s.weight} value={`${lastWeight.toFixed(1)} kg`} sub={`${delta} kg`} />
          <Stat label={s.target} value={`${kcal.toLocaleString(lang)} kcal`} sub={`P ${protein} · C ${carbs} · F ${fat}`} />
          <Stat label={s.adherence} value={`${client.adherence}%`} sub={`${s.nextVisit}: ${client.nextVisit[lang]}`} />
          <Card>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.goal}</p>
            <p className="mt-2 text-ink">{client.goal[lang]}</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.allergies}</p>
            <p className="mt-2 text-ink">{client.allergies[lang]}</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.notes}</p>
            <p className="mt-2 text-sm text-ink">{client.notes[lang]}</p>
          </Card>
          <Recorder
            s={s}
            lang={lang}
            onDraft={() => {
              setDraft(true);
              setTab("nutrition");
            }}
          />
          <Card className="bg-sage-soft">
            <p className="flex items-center gap-2 text-sm font-semibold text-sage">
              <Sparkles className="h-4 w-4" />
              {s.weekly}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{s.weeklyText}</p>
          </Card>
        </div>
      )}

      {tab === "measures" && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <p className="text-sm font-semibold text-ink">{s.trend}</p>
            <WeightChart data={weights} />
          </Card>
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              <Stat label={s.weight} value={`${lastWeight.toFixed(1)} kg`} />
              <Stat label={s.bodyFat} value={`${client.bodyFat}%`} />
              <Stat label={s.waist} value={`${client.waist} cm`} />
            </div>
            <Card>
              <p className="text-sm font-semibold text-ink">{s.addEntry}</p>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const v = parseFloat(newWeight.replace(",", "."));
                  if (v > 30 && v < 300) {
                    setWeights((w) => [...w.slice(1), v]);
                    setNewWeight("");
                  }
                }}
              >
                <input
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  inputMode="decimal"
                  placeholder="kg"
                  className="min-w-0 flex-1 rounded-xl border bg-cream px-3 py-2 outline-none focus:border-terra"
                />
                <button className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-cream">{s.save}</button>
              </form>
            </Card>
          </div>
        </div>
      )}

      {tab === "nutrition" && (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {draft && (
              <p className="flex items-center gap-2 rounded-xl bg-terra-soft px-4 py-2.5 text-sm font-medium text-terra-dark animate-in fade-in">
                <Sparkles className="h-4 w-4" />
                {s.aiDraft}
              </p>
            )}
            {s.meals.map((m) => (
              <Card key={m.name} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-terra">{m.name}</p>
                  <p className="mt-1 text-sm text-ink">{m.items}</p>
                </div>
                <p className="shrink-0 font-semibold text-ink">{Math.round(kcal * m.share)} kcal</p>
              </Card>
            ))}
          </div>
          <Card className="h-fit">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {s.target} · {s.phases[phase]}
            </p>
            <p className="mt-1 font-display text-4xl font-semibold text-ink">{kcal.toLocaleString(lang)}</p>
            <p className="text-sm text-muted-foreground">kcal</p>
            <p className="mt-5 text-sm font-semibold text-ink">{s.macros}</p>
            {[
              { k: s.protein, v: protein, kcal: protein * 4, c: "bg-terra" },
              { k: s.carbs, v: carbs, kcal: carbs * 4, c: "bg-gold" },
              { k: s.fat, v: fat, kcal: fat * 9, c: "bg-sage" },
            ].map((m) => (
              <div key={m.k} className="mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{m.k}</span>
                  <span className="font-semibold text-ink">{m.v} g</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-sand">
                  <div className={`h-2 rounded-full transition-all duration-500 ${m.c}`} style={{ width: `${Math.min(100, (m.kcal / kcal) * 100)}%` }} />
                </div>
              </div>
            ))}
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink px-4 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-cream">
              <FileText className="h-4 w-4" />
              {s.exportPdf}
            </button>
          </Card>
        </div>
      )}

      {tab === "training" && (
        <div className="space-y-5">
          <Card>
            <p className="text-sm font-semibold text-ink">{s.split}</p>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {s.days.map((d, i) => (
                <div key={i} className={cn("rounded-xl px-1 py-3 text-center text-xs font-medium", i === 0 ? "bg-ink text-cream" : "bg-sand text-ink")}>
                  {d}
                </div>
              ))}
            </div>
          </Card>
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[420px] text-sm">
              <tbody>
                {s.exercises.map(([name, sets, rir]) => (
                  <tr key={name} className="border-b last:border-0">
                    <td className="px-5 py-3 font-medium text-ink">{name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{sets}</td>
                    <td className="px-5 py-3 text-muted-foreground">{rir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <p className="flex items-center gap-2 rounded-xl bg-sage-soft px-4 py-3 text-sm text-ink">
            <Sparkles className="h-4 w-4 text-sage" />
            {s.aiProgress}
          </p>
        </div>
      )}

      {tab === "diary" && (
        <div className="space-y-5">
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-sand text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {s.diaryCols.map((c) => (
                    <th key={c} className="px-5 py-3 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {checkins.map((c) => (
                  <tr key={c.date} className="border-t">
                    <td className="px-5 py-3 font-medium text-ink">{c.date}</td>
                    <td className="px-5 py-3">{c.weight} kg</td>
                    <td className="px-5 py-3">{c.steps.toLocaleString(lang)}</td>
                    <td className={cn("px-5 py-3", c.sleep < 6.5 && "text-terra")}>{c.sleep} h</td>
                    <td className={cn("px-5 py-3", c.hunger >= 7 && "text-terra")}>{c.hunger}/10</td>
                    <td className="px-5 py-3">{c.energy}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card className="bg-sage-soft">
            <p className="flex items-center gap-2 text-sm font-semibold text-sage">
              <Sparkles className="h-4 w-4" />
              {s.weekly}
            </p>
            <p className="mt-2 text-sm text-ink">{s.weeklyText}</p>
          </Card>
        </div>
      )}
    </div>
  );
}

export function DemoApp({ lang }: { lang: Locale }) {
  const s = T[lang];
  const [view, setView] = useState<View>("clients");
  const [selected, setSelected] = useState(clients[0].id);
  const [query, setQuery] = useState("");
  const client = clients.find((c) => c.id === selected) ?? clients[0];
  const filtered = useMemo(() => clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())), [query]);

  const navItems: { key: View; icon: typeof Home }[] = [
    { key: "dashboard", icon: Home },
    { key: "clients", icon: Users },
    { key: "calendar", icon: CalendarDays },
    { key: "billing", icon: Receipt },
  ];

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-card p-4 md:flex">
        <div className="flex items-center gap-2 px-2 py-2">
          <LogoMark />
          <span className="font-display text-xl font-semibold text-ink">Fisicora</span>
        </div>
        <nav className="mt-6 space-y-1">
          {navItems.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                view === key ? "bg-terra-soft text-terra-dark" : "text-ink-soft hover:bg-sand",
              )}
            >
              <Icon className="h-4 w-4" />
              {s.nav[key]}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <Link href={`/${lang === "en" ? "it" : "en"}/app`} className="block rounded-xl border px-3 py-2 text-center text-xs font-semibold uppercase text-ink-soft hover:border-ink">
            {lang === "en" ? "Italiano" : "English"}
          </Link>
          <Link href={`/${lang}`} className="flex items-center gap-2 px-3 text-sm text-muted-foreground hover:text-terra">
            <ArrowLeft className="h-4 w-4" />
            {s.back}
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-cream/90 px-4 py-3 backdrop-blur sm:px-6">
          <Link href={`/${lang}`} className="md:hidden" aria-label={s.back}>
            <LogoMark />
          </Link>
          <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-[#8a5a00]">{s.demoBadge}</span>
          <div className="ml-auto flex gap-1 md:hidden">
            {navItems.map(({ key, icon: Icon }) => (
              <button key={key} onClick={() => setView(key)} aria-label={s.nav[key]} className={cn("rounded-lg p-2", view === key ? "bg-terra-soft text-terra" : "text-ink-soft")}>
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {view === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-semibold text-ink">{s.dashTitle}</h1>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Stat label={s.stats[0]} value="38" sub="+4" />
                <Stat label={s.stats[1]} value="27" />
                <Stat label={s.stats[2]} value={lang === "it" ? "11,5 h" : "11.5 h"} sub={lang === "it" ? "+2,1 h" : "+2.1 h"} />
                <Stat label={s.stats[3]} value={lang === "it" ? "€ 4.860" : "€ 4,860"} sub="+12%" />
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                <Card>
                  <p className="font-semibold text-ink">{s.today}</p>
                  <ul className="mt-3 divide-y">
                    {clients.map((c) => (
                      <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                        <span className="text-ink">{c.name}</span>
                        <span className="text-muted-foreground">{c.nextVisit[lang]}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card>
                  <p className="font-semibold text-ink">{s.flags}</p>
                  <ul className="mt-3 space-y-3">
                    {clients
                      .filter((c) => c.status === "flag")
                      .map((c) => (
                        <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-terra-soft px-4 py-3 text-sm">
                          <span>
                            <span className="font-semibold text-ink">{c.name}</span>
                            <span className="block text-terra-dark">{s.flagText[c.id]}</span>
                          </span>
                          <button
                            onClick={() => {
                              setSelected(c.id);
                              setView("clients");
                            }}
                            className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-ink"
                          >
                            {s.open}
                          </button>
                        </li>
                      ))}
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {view === "clients" && (
            <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
              <div className="space-y-3">
                <label className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={s.search} className="w-full bg-transparent text-sm outline-none" />
                </label>
                <ul className="flex gap-2 overflow-x-auto xl:flex-col xl:overflow-visible">
                  {filtered.map((c) => (
                    <li key={c.id} className="shrink-0">
                      <button
                        onClick={() => setSelected(c.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                          c.id === selected ? "border-terra bg-terra-soft" : "bg-card hover:border-ink/30",
                        )}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-sm font-semibold text-ink">{c.initials}</span>
                        <span>
                          <span className="block text-sm font-semibold text-ink">{c.name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {s.types[c.type]} · {s.phases[c.phase]}
                          </span>
                        </span>
                        {c.status === "flag" && <span className="ml-auto h-2 w-2 rounded-full bg-terra" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <ClientRecord key={client.id} client={client} s={s} lang={lang} />
            </div>
          )}

          {(view === "calendar" || view === "billing") && (
            <Card className="flex flex-col items-center py-16 text-center">
              {view === "calendar" ? <CalendarDays className="h-10 w-10 text-terra" /> : <Receipt className="h-10 w-10 text-terra" />}
              <p className="mt-4 max-w-md text-ink">{view === "calendar" ? s.calendarSoon : s.billingSoon}</p>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
