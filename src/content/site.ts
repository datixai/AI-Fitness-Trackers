export const locales = ["en", "it"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const en = {
  meta: {
    title: "Fisicora | AI software for coaches and nutritionists",
    description:
      "Fisicora takes the admin out of coaching and nutrition practice: AI check-in notes, meal plans with macros, training plans, reminders and invoices.",
  },
  nav: {
    how: "How it works",
    features: "Features",
    who: "Who it's for",
    pricing: "Pricing",
    faq: "FAQ",
    demo: "Book a demo",
    app: "Live demo",
  },
  hero: {
    badge: "Made in Europe for coaches and nutritionists",
    title1: "Less admin.",
    title2: "More results.",
    subtitle:
      "Fisicora listens to your check-ins and consultations, writes the notes, drafts meal and training plans with macros, and handles reminders and invoices. You stay the expert. The AI does the paperwork.",
    primary: "Start free for 14 days",
    secondary: "Try the live demo",
    note: "No card needed. GDPR ready. Cancel anytime.",
  },
  preview: {
    title: "One client record. Everything in it.",
    subtitle: "Check-ins, measurements, nutrition, training and invoices in one calm place.",
  },
  how: {
    eyebrow: "How it works",
    title: "From conversation to plan in three steps",
    steps: [
      {
        title: "Talk, don't type",
        text: "Start a session and speak naturally with your client, in the studio or on a video call. Fisicora transcribes in Italian or English as you go.",
      },
      {
        title: "AI writes the summary",
        text: "Goals, symptoms, allergies, training history, sleep and stress are pulled out into a clear client summary you can edit in seconds.",
      },
      {
        title: "Approve the plan",
        text: "Fisicora drafts the meal plan and training block with calories and macros for the current phase. You review, adjust and send a branded PDF.",
      },
    ],
  },
  features: {
    eyebrow: "AI in every corner",
    title: "Built to remove the repetitive work",
    subtitle: "Each module saves time on its own. Together they run your practice.",
    tabs: [
      {
        key: "nutrition",
        label: "Meal plans",
        title: "Meal plans with macros in minutes",
        text: "Generate a full day or week of meals from the consultation, matched to calories, protein, carbs and fats. Swap any food and the macros update instantly.",
        points: [
          "Draft plans built from the conversation",
          "Italian and European food database",
          "Automatic calorie and macro targets per phase",
          "Branded PDF for your client",
        ],
      },
      {
        key: "training",
        label: "Training",
        title: "Training blocks that follow the phase",
        text: "Build splits for cut, offseason or maintenance. Track volume, load and intensity techniques, and let the AI suggest the next progression.",
        points: [
          "Split templates: push pull legs, upper lower, full body",
          "Sets, reps, RIR and load tracking",
          "Progression suggestions from logged sessions",
          "Exercise library with technique notes",
        ],
      },
      {
        key: "checkins",
        label: "Check-ins",
        title: "Weekly check-ins without the chasing",
        text: "Clients send weight, steps, sleep, hunger and photos from their phone. Fisicora summarises the week and flags what needs your attention.",
        points: [
          "Weight trend and body measurements",
          "Progress photos side by side",
          "AI weekly summary with flags",
          "Diet break and refeed reminders",
        ],
      },
      {
        key: "calendar",
        label: "Calendar",
        title: "Appointments and reminders on autopilot",
        text: "Clients book their own slots. Fisicora sends confirmations and reminders by email or WhatsApp, so fewer sessions are missed.",
        points: [
          "Online booking page",
          "Automatic reminders",
          "Video call links",
          "Google and Outlook calendar sync",
        ],
      },
      {
        key: "billing",
        label: "Billing",
        title: "Invoices and payments handled",
        text: "Create invoices after each session or package, collect payments with card or SEPA and keep everything ready for your accountant.",
        points: [
          "Packages and subscriptions",
          "Card, SEPA and PayPal",
          "Italian electronic invoice ready",
          "Monthly revenue overview",
        ],
      },
    ],
  },
  who: {
    eyebrow: "Who it's for",
    title: "One platform, two kinds of experts",
    coach: {
      title: "Physique coaches",
      text: "For bodybuilding, fitness and physique coaches who run online or in-person clients.",
      points: [
        "Cut, offseason, diet break and peak week phases",
        "Weekly check-ins with photos and measurements",
        "Training splits with progression",
        "Macro targets that move with the phase",
      ],
    },
    nutritionist: {
      title: "Nutritionists and dietitians",
      text: "For nutrition professionals in private practice, clinics and medical centres.",
      points: [
        "AI anamnesis and consultation notes",
        "Allergies, intolerances and conditions tracked",
        "Clinical and sports meal plans",
        "Follow-ups, reminders and invoices",
      ],
    },
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Simple plans that grow with you",
    subtitle: "All plans include the AI assistant, GDPR compliant hosting in the EU and free onboarding.",
    perMonth: "/month",
    popular: "Most popular",
    cta: "Start free",
    plans: [
      {
        name: "Starter",
        price: "29",
        text: "For professionals starting out",
        points: ["Up to 25 active clients", "AI notes and summaries", "Meal plans with macros", "Email support"],
      },
      {
        name: "Pro",
        price: "59",
        text: "For busy coaches and practices",
        points: [
          "Unlimited clients",
          "AI meal and training plans",
          "Check-ins, photos and reminders",
          "Invoices and online payments",
          "Priority support",
        ],
      },
      {
        name: "Studio",
        price: "119",
        text: "For teams, gyms and clinics",
        points: ["Up to 5 team members", "Shared client records", "Custom branding on PDFs", "Dedicated onboarding"],
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions we hear often",
    items: [
      {
        q: "Does the AI replace my professional judgement?",
        a: "No. Fisicora prepares drafts: notes, summaries and plans. Nothing reaches a client until you review and approve it.",
      },
      {
        q: "Is my clients' data safe?",
        a: "Data is encrypted and hosted in the European Union, and the platform is designed around GDPR. Clients can consent to recording before each session.",
      },
      {
        q: "Does it work in Italian?",
        a: "Yes. Transcription, summaries, plans and the whole interface work in Italian and English.",
      },
      {
        q: "Can I use it for online coaching?",
        a: "Yes. Clients use the app to send check-ins, photos and logs, and you can record video consultations too.",
      },
      {
        q: "Which diets are supported?",
        a: "Any approach you use: flexible dieting, Mediterranean, vegetarian, vegan, low carb, carb cycling and clinical diets.",
      },
      {
        q: "How long does it take to start?",
        a: "Most professionals are set up in under an hour. We help you import your existing clients for free.",
      },
    ],
  },
  demo: {
    eyebrow: "Book a demo",
    title: "See Fisicora with your own workflow",
    subtitle: "A free 30 minute call with our team. We'll show how much time you can save every week.",
    perks: ["30 minute guided demo", "Personal setup help", "No commitment"],
    firstName: "First name",
    lastName: "Last name",
    email: "Work email",
    phone: "Phone number",
    role: "I am a",
    roles: ["Physique coach", "Nutritionist or dietitian", "Gym or studio", "Clinic", "Other"],
    consent: "I agree to the privacy policy and to be contacted about my demo.",
    submit: "Request my demo",
    sending: "Sending...",
    thanks: "Thank you! We'll be in touch within one working day.",
    error: "Please fill in all fields and accept the privacy policy.",
  },
  footer: {
    tagline: "AI software for coaches and nutritionists.",
    columns: [
      { title: "Professionals", links: ["Physique coaches", "Nutritionists", "Dietitians", "Personal trainers", "Sports nutrition"] },
      { title: "Organisations", links: ["Gyms and studios", "Clinics", "Sports teams", "Medical centres"] },
      { title: "Resources", links: ["Blog", "Help centre", "Scientific sources", "Updates"] },
      { title: "Legal", links: ["Privacy policy", "Terms", "Cookie policy", "Data processing"] },
    ],
    newsletter: "Tips and product news, once a month",
    subscribe: "Subscribe",
    emailPlaceholder: "Your email",
    rights: "All rights reserved.",
  },
};

export type Dictionary = typeof en;

const it: Dictionary = {
  meta: {
    title: "Fisicora | Software AI per coach e nutrizionisti",
    description:
      "Fisicora elimina la burocrazia dal lavoro di coach e nutrizionisti: note AI dei check-in, piani alimentari con macro, schede di allenamento, promemoria e fatture.",
  },
  nav: {
    how: "Come funziona",
    features: "Funzioni",
    who: "Per chi",
    pricing: "Prezzi",
    faq: "FAQ",
    demo: "Prenota una demo",
    app: "Demo live",
  },
  hero: {
    badge: "Creato in Europa per coach e nutrizionisti",
    title1: "Meno burocrazia.",
    title2: "Più risultati.",
    subtitle:
      "Fisicora ascolta i tuoi check-in e le tue visite, scrive le note, prepara piani alimentari e di allenamento con i macro e gestisce promemoria e fatture. L'esperto resti tu. Le carte le fa l'AI.",
    primary: "Prova gratis per 14 giorni",
    secondary: "Prova la demo live",
    note: "Nessuna carta richiesta. Conforme GDPR. Disdici quando vuoi.",
  },
  preview: {
    title: "Una scheda cliente. Tutto dentro.",
    subtitle: "Check-in, misure, nutrizione, allenamento e fatture in un unico posto ordinato.",
  },
  how: {
    eyebrow: "Come funziona",
    title: "Dalla conversazione al piano in tre passi",
    steps: [
      {
        title: "Parla, non scrivere",
        text: "Avvia la sessione e parla con il cliente in modo naturale, in studio o in videochiamata. Fisicora trascrive in italiano o in inglese in tempo reale.",
      },
      {
        title: "L'AI scrive il riepilogo",
        text: "Obiettivi, sintomi, allergie, storia di allenamento, sonno e stress diventano un riepilogo chiaro che modifichi in pochi secondi.",
      },
      {
        title: "Approva il piano",
        text: "Fisicora prepara il piano alimentare e il blocco di allenamento con calorie e macro per la fase attuale. Tu controlli, modifichi e invii un PDF personalizzato.",
      },
    ],
  },
  features: {
    eyebrow: "AI ovunque",
    title: "Pensato per togliere il lavoro ripetitivo",
    subtitle: "Ogni modulo fa risparmiare tempo da solo. Insieme gestiscono il tuo studio.",
    tabs: [
      {
        key: "nutrition",
        label: "Piani alimentari",
        title: "Piani alimentari con macro in pochi minuti",
        text: "Genera una giornata o una settimana di pasti partendo dalla visita, con calorie, proteine, carboidrati e grassi. Sostituisci un alimento e i macro si aggiornano subito.",
        points: [
          "Bozze di piano create dalla conversazione",
          "Database di alimenti italiani ed europei",
          "Calorie e macro automatici per ogni fase",
          "PDF personalizzato per il cliente",
        ],
      },
      {
        key: "training",
        label: "Allenamento",
        title: "Blocchi di allenamento che seguono la fase",
        text: "Crea split per definizione, offseason o mantenimento. Monitora volume, carichi e tecniche di intensità e lascia che l'AI suggerisca la progressione.",
        points: [
          "Modelli di split: push pull legs, upper lower, full body",
          "Serie, ripetizioni, RIR e carichi",
          "Suggerimenti di progressione dalle sessioni",
          "Libreria esercizi con note tecniche",
        ],
      },
      {
        key: "checkins",
        label: "Check-in",
        title: "Check-in settimanali senza rincorrere nessuno",
        text: "I clienti inviano peso, passi, sonno, fame e foto dal telefono. Fisicora riassume la settimana e segnala cosa richiede la tua attenzione.",
        points: [
          "Andamento del peso e misure corporee",
          "Foto dei progressi a confronto",
          "Riepilogo settimanale AI con avvisi",
          "Promemoria per diet break e refeed",
        ],
      },
      {
        key: "calendar",
        label: "Agenda",
        title: "Appuntamenti e promemoria automatici",
        text: "I clienti prenotano da soli. Fisicora invia conferme e promemoria via email o WhatsApp, così salti meno appuntamenti.",
        points: [
          "Pagina di prenotazione online",
          "Promemoria automatici",
          "Link per videochiamate",
          "Sincronizzazione con Google e Outlook",
        ],
      },
      {
        key: "billing",
        label: "Fatture",
        title: "Fatture e pagamenti gestiti",
        text: "Crea fatture dopo ogni visita o pacchetto, incassa con carta o SEPA e tieni tutto pronto per il commercialista.",
        points: [
          "Pacchetti e abbonamenti",
          "Carta, SEPA e PayPal",
          "Pronto per la fattura elettronica",
          "Panoramica mensile degli incassi",
        ],
      },
    ],
  },
  who: {
    eyebrow: "Per chi",
    title: "Una piattaforma, due tipi di esperti",
    coach: {
      title: "Coach di fisico",
      text: "Per coach di bodybuilding, fitness e physique che seguono clienti online o in presenza.",
      points: [
        "Fasi di definizione, offseason, diet break e peak week",
        "Check-in settimanali con foto e misure",
        "Split di allenamento con progressione",
        "Macro che cambiano con la fase",
      ],
    },
    nutritionist: {
      title: "Nutrizionisti e dietisti",
      text: "Per professionisti della nutrizione in studio privato, cliniche e centri medici.",
      points: [
        "Anamnesi e note di visita con l'AI",
        "Allergie, intolleranze e patologie sempre in vista",
        "Piani clinici e sportivi",
        "Controlli, promemoria e fatture",
      ],
    },
  },
  pricing: {
    eyebrow: "Prezzi",
    title: "Piani semplici che crescono con te",
    subtitle: "Tutti i piani includono l'assistente AI, hosting conforme GDPR in UE e onboarding gratuito.",
    perMonth: "/mese",
    popular: "Il più scelto",
    cta: "Inizia gratis",
    plans: [
      {
        name: "Starter",
        price: "29",
        text: "Per chi inizia",
        points: ["Fino a 25 clienti attivi", "Note e riepiloghi AI", "Piani alimentari con macro", "Supporto via email"],
      },
      {
        name: "Pro",
        price: "59",
        text: "Per coach e studi impegnati",
        points: [
          "Clienti illimitati",
          "Piani alimentari e di allenamento AI",
          "Check-in, foto e promemoria",
          "Fatture e pagamenti online",
          "Supporto prioritario",
        ],
      },
      {
        name: "Studio",
        price: "119",
        text: "Per team, palestre e cliniche",
        points: ["Fino a 5 membri del team", "Schede clienti condivise", "Logo personalizzato sui PDF", "Onboarding dedicato"],
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Le domande più frequenti",
    items: [
      {
        q: "L'AI sostituisce il mio giudizio professionale?",
        a: "No. Fisicora prepara bozze: note, riepiloghi e piani. Nulla arriva al cliente finché non lo controlli e lo approvi.",
      },
      {
        q: "I dati dei miei clienti sono al sicuro?",
        a: "I dati sono cifrati e ospitati nell'Unione Europea e la piattaforma è progettata secondo il GDPR. Il cliente può dare il consenso alla registrazione prima di ogni sessione.",
      },
      {
        q: "Funziona in italiano?",
        a: "Sì. Trascrizione, riepiloghi, piani e tutta l'interfaccia funzionano in italiano e in inglese.",
      },
      {
        q: "Posso usarlo per il coaching online?",
        a: "Sì. I clienti usano l'app per inviare check-in, foto e diari, e puoi registrare anche le videochiamate.",
      },
      {
        q: "Quali diete sono supportate?",
        a: "Qualsiasi approccio: dieta flessibile, mediterranea, vegetariana, vegana, low carb, carb cycling e diete cliniche.",
      },
      {
        q: "Quanto tempo serve per iniziare?",
        a: "La maggior parte dei professionisti è operativa in meno di un'ora. Importiamo gratis i tuoi clienti esistenti.",
      },
    ],
  },
  demo: {
    eyebrow: "Prenota una demo",
    title: "Guarda Fisicora con il tuo metodo di lavoro",
    subtitle: "Una chiamata gratuita di 30 minuti con il nostro team. Ti mostriamo quanto tempo puoi risparmiare ogni settimana.",
    perks: ["Demo guidata di 30 minuti", "Aiuto nella configurazione", "Nessun impegno"],
    firstName: "Nome",
    lastName: "Cognome",
    email: "Email di lavoro",
    phone: "Telefono",
    role: "Sono",
    roles: ["Coach di fisico", "Nutrizionista o dietista", "Palestra o studio", "Clinica", "Altro"],
    consent: "Accetto la privacy policy e di essere contattato per la demo.",
    submit: "Richiedi la demo",
    sending: "Invio in corso...",
    thanks: "Grazie! Ti contatteremo entro un giorno lavorativo.",
    error: "Compila tutti i campi e accetta la privacy policy.",
  },
  footer: {
    tagline: "Software AI per coach e nutrizionisti.",
    columns: [
      { title: "Professionisti", links: ["Coach di fisico", "Nutrizionisti", "Dietisti", "Personal trainer", "Nutrizione sportiva"] },
      { title: "Organizzazioni", links: ["Palestre e studi", "Cliniche", "Squadre sportive", "Centri medici"] },
      { title: "Risorse", links: ["Blog", "Centro assistenza", "Fonti scientifiche", "Novità"] },
      { title: "Legale", links: ["Privacy policy", "Termini", "Cookie policy", "Trattamento dati"] },
    ],
    newsletter: "Consigli e novità, una volta al mese",
    subscribe: "Iscriviti",
    emailPlaceholder: "La tua email",
    rights: "Tutti i diritti riservati.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, it };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
