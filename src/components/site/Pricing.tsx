import { Check } from "lucide-react";
import type { Dictionary } from "@/content/site";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Pricing({ t }: { t: Dictionary["pricing"] }) {
  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {t.plans.map((plan, i) => {
            const featured = i === 1;
            return (
              <Reveal key={plan.name} delay={i * 100}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-[28px] border p-8 transition-all hover:-translate-y-1",
                    featured ? "border-ink bg-ink text-cream shadow-[0_30px_60px_-30px_rgb(20_33_61/0.6)]" : "bg-card text-ink",
                  )}
                >
                  {featured && (
                    <span className="absolute -top-3 left-8 rounded-full bg-terra px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {t.popular}
                    </span>
                  )}
                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  <p className={cn("mt-1", featured ? "text-cream/70" : "text-muted-foreground")}>{plan.text}</p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-5xl font-semibold">€{plan.price}</span>
                    <span className={featured ? "text-cream/70" : "text-muted-foreground"}>{t.perMonth}</span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <Check className={cn("mt-0.5 h-5 w-5 shrink-0", featured ? "text-gold" : "text-sage")} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#demo"
                    className={cn(
                      "mt-8 rounded-full px-6 py-3 text-center font-semibold transition-colors",
                      featured ? "bg-terra text-white hover:bg-terra-dark" : "border border-ink text-ink hover:bg-ink hover:text-cream",
                    )}
                  >
                    {t.cta}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
