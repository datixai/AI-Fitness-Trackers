"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Dictionary } from "@/content/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function Faq({ t }: { t: Dictionary["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-gradient-to-b from-cream to-sand px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <Reveal className="mt-12 space-y-3">
          {t.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="rounded-2xl border bg-card">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-ink"
                >
                  {item.q}
                  <Plus className={cn("h-5 w-5 shrink-0 text-terra transition-transform duration-300", isOpen && "rotate-45")} />
                </button>
                <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 leading-relaxed text-muted-foreground">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
