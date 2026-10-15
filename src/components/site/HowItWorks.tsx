import { FileCheck2, Mic, Sparkles } from "lucide-react";
import type { Dictionary } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const icons = [Mic, Sparkles, FileCheck2];

export function HowItWorks({ t }: { t: Dictionary["how"] }) {
  return (
    <section id="how" className="bg-gradient-to-b from-cream to-sand px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          <div aria-hidden className="absolute left-[16%] right-[16%] top-10 hidden border-t-2 border-dashed border-terra/30 md:block" />
          {t.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={step.title} delay={i * 120}>
                <div className="relative h-full rounded-3xl border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgb(20_33_61/0.35)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terra-soft text-terra">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-4xl font-semibold text-sand [-webkit-text-stroke:1px_var(--border)]">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
