import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-terra">{eyebrow}</p>
      <h2 className={cn("mt-3 text-3xl font-semibold leading-tight sm:text-5xl", light ? "text-cream" : "text-ink")}>{title}</h2>
      {subtitle && <p className={cn("mt-4 text-lg", light ? "text-cream/70" : "text-muted-foreground")}>{subtitle}</p>}
    </Reveal>
  );
}
