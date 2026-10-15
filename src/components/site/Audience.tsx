import { Check, Dumbbell, Stethoscope } from "lucide-react";
import type { Dictionary } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Audience({ t }: { t: Dictionary["who"] }) {
  const cards = [
    { ...t.coach, Icon: Dumbbell, tone: "bg-ink text-cream", sub: "text-cream/70", chip: "bg-terra text-white" },
    { ...t.nutritionist, Icon: Stethoscope, tone: "bg-card text-ink", sub: "text-muted-foreground", chip: "bg-sage-soft text-sage" },
  ];
  return (
    <section id="who" className="bg-gradient-to-b from-cream to-terra-soft/40 px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {cards.map(({ title, text, points, Icon, tone, sub, chip }, i) => (
            <Reveal key={title} delay={i * 120}>
              <div className={`h-full rounded-[32px] border p-8 sm:p-10 ${tone}`}>
                <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${chip}`}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-3xl font-semibold">{title}</h3>
                <p className={`mt-3 text-lg ${sub}`}>{text}</p>
                <ul className="mt-6 space-y-3">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <Check className="mt-1 h-5 w-5 shrink-0 text-terra" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
