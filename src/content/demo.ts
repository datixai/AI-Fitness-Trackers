// Demo data for the clickable app preview. All people are fictional.

export type Phase = "cut" | "offseason" | "dietBreak" | "maintenance";

export type Client = {
  id: string;
  name: string;
  initials: string;
  age: number;
  type: "coach" | "nutrition";
  phase: Phase;
  week: number;
  email: string;
  phone: string;
  goal: { en: string; it: string };
  notes: { en: string; it: string };
  allergies: { en: string; it: string };
  weights: number[];
  bodyFat: number;
  waist: number;
  adherence: number;
  nextVisit: { en: string; it: string };
  status: "ok" | "flag";
};

export const clients: Client[] = [
  {
    id: "giulia",
    name: "Giulia Rossi",
    initials: "GR",
    age: 29,
    type: "coach",
    phase: "cut",
    week: 6,
    email: "giulia.rossi@example.com",
    phone: "+39 333 000 1122",
    goal: { en: "Bikini prep, stage in 14 weeks", it: "Preparazione bikini, gara tra 14 settimane" },
    notes: {
      en: "Trains 5 days, upper lower split. Evening hunger rising. Prefers rice over pasta at lunch.",
      it: "Si allena 5 giorni, split upper lower. Fame serale in aumento. Preferisce riso alla pasta a pranzo.",
    },
    allergies: { en: "None", it: "Nessuna" },
    weights: [64.8, 64.5, 64.3, 64.4, 63.9, 63.6, 63.5, 63.1, 63.2, 62.8, 62.6, 62.3],
    bodyFat: 19.4,
    waist: 68,
    adherence: 92,
    nextVisit: { en: "Thu 10:30", it: "Gio 10:30" },
    status: "flag",
  },
  {
    id: "marco",
    name: "Marco Bianchi",
    initials: "MB",
    age: 34,
    type: "coach",
    phase: "offseason",
    week: 28,
    email: "marco.bianchi@example.com",
    phone: "+39 347 000 3344",
    goal: { en: "Lean offseason, add 3 kg of quality mass", it: "Offseason pulita, +3 kg di massa di qualità" },
    notes: {
      en: "Push pull legs, 6 days. Digestion fine at 3,400 kcal. Sleep 7.5 h.",
      it: "Push pull legs, 6 giorni. Digestione ok a 3.400 kcal. Sonno 7,5 h.",
    },
    allergies: { en: "None", it: "Nessuna" },
    weights: [88.1, 88.3, 88.2, 88.6, 88.9, 88.8, 89.1, 89.3, 89.2, 89.6, 89.8, 90.0],
    bodyFat: 13.1,
    waist: 84,
    adherence: 96,
    nextVisit: { en: "Fri 18:00", it: "Ven 18:00" },
    status: "ok",
  },
  {
    id: "sofia",
    name: "Sofia Conti",
    initials: "SC",
    age: 41,
    type: "nutrition",
    phase: "maintenance",
    week: 3,
    email: "sofia.conti@example.com",
    phone: "+39 320 000 5566",
    goal: { en: "Improve energy and digestion, lose 4 kg slowly", it: "Più energia e digestione migliore, -4 kg con calma" },
    notes: {
      en: "Office job, walks 6,000 steps. Bloating after dairy. Skips breakfast often.",
      it: "Lavoro d'ufficio, 6.000 passi. Gonfiore dopo i latticini. Salta spesso la colazione.",
    },
    allergies: { en: "Lactose intolerance", it: "Intolleranza al lattosio" },
    weights: [71.2, 71.0, 71.1, 70.8, 70.6, 70.7, 70.4, 70.3, 70.1, 70.2, 69.9, 69.8],
    bodyFat: 31.0,
    waist: 82,
    adherence: 84,
    nextVisit: { en: "Wed 09:00", it: "Mer 09:00" },
    status: "ok",
  },
  {
    id: "luca",
    name: "Luca Ferri",
    initials: "LF",
    age: 26,
    type: "coach",
    phase: "dietBreak",
    week: 12,
    email: "luca.ferri@example.com",
    phone: "+39 351 000 7788",
    goal: { en: "Men's physique, 2 week diet break before final cut", it: "Men's physique, diet break di 2 settimane prima del cut finale" },
    notes: {
      en: "Low energy last 2 weeks, training performance dropping. Calories to maintenance.",
      it: "Energia bassa nelle ultime 2 settimane, prestazioni in calo. Calorie a mantenimento.",
    },
    allergies: { en: "Peanuts", it: "Arachidi" },
    weights: [79.9, 79.4, 79.0, 78.7, 78.2, 77.9, 77.5, 77.2, 76.9, 76.8, 77.3, 77.6],
    bodyFat: 10.2,
    waist: 76,
    adherence: 88,
    nextVisit: { en: "Mon 12:00", it: "Lun 12:00" },
    status: "flag",
  },
];

// Calorie targets per phase, as a multiple of the client's maintenance estimate.
export const phaseFactor: Record<Phase, number> = { cut: 0.8, offseason: 1.1, dietBreak: 1, maintenance: 1 };

export const maintenanceKcal: Record<string, number> = { giulia: 2050, marco: 3100, sofia: 1950, luca: 2700 };

export const transcript = {
  en: [
    ["coach", "How did the week go with the new carb split?"],
    ["client", "Training felt strong, but I'm really hungry after 9 pm."],
    ["coach", "How many hours are you sleeping?"],
    ["client", "Around six, a bit less on work days."],
    ["coach", "Any digestion issues or foods you want to change?"],
    ["client", "No issues. I'd love rice instead of potatoes at lunch."],
  ],
  it: [
    ["coach", "Com'è andata la settimana con la nuova divisione dei carboidrati?"],
    ["client", "Allenamenti ottimi, ma dopo le 21 ho tantissima fame."],
    ["coach", "Quante ore dormi?"],
    ["client", "Circa sei, un po' meno nei giorni di lavoro."],
    ["coach", "Problemi di digestione o alimenti da cambiare?"],
    ["client", "Nessun problema. Vorrei il riso al posto delle patate a pranzo."],
  ],
} as const;

export const checkins = [
  { date: "13/10", weight: 62.3, steps: 11200, sleep: 6.1, hunger: 8, energy: 7 },
  { date: "12/10", weight: 62.6, steps: 9800, sleep: 6.4, hunger: 7, energy: 7 },
  { date: "11/10", weight: 62.8, steps: 12400, sleep: 6.8, hunger: 7, energy: 8 },
  { date: "10/10", weight: 63.2, steps: 10100, sleep: 6.2, hunger: 6, energy: 7 },
  { date: "09/10", weight: 63.1, steps: 10600, sleep: 6.5, hunger: 6, energy: 8 },
];
