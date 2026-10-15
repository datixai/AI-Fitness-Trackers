import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-8 w-8", className)}>
      <rect width="32" height="32" rx="9" fill="var(--ink)" />
      <path d="M10 23V9h11" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10 16h7" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="22.5" cy="20.5" r="3.5" fill="var(--terra)" />
    </svg>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className={cn("font-display text-[22px] font-semibold tracking-tight", light ? "text-cream" : "text-ink")}>
        Fisicora
      </span>
    </span>
  );
}
