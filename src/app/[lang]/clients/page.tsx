import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/content/site";
import { getPortal } from "@/content/portal";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PortalShell } from "@/components/portal/PortalShell";
import { AddClientForm } from "@/components/portal/AddClientForm";

export const metadata = { title: "Fisicora | Clients", robots: { index: false } };

export default async function ClientsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const user = await requireUser(lang);
  const p = getPortal(lang);
  const t = p.clients;

  const clients = await db.client.findMany({
    where: { ownerId: user.id, archived: false },
    orderBy: { createdAt: "desc" },
    include: { measures: { orderBy: { date: "desc" }, take: 1 } },
  });

  return (
    <PortalShell lang={lang} user={user} t={p.nav} path="clients">
      <h1 className="text-4xl font-semibold text-ink">{t.title}</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
        {clients.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">{t.empty}</p>
        ) : (
          <ul className="divide-y">
            {clients.map((c) => {
              const w = c.measures[0]?.weightKg;
              const initials = c.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
              return (
                <li key={c.id}>
                  <Link href={`/${lang}/clients/${c.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-sand/60">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terra-soft font-display font-semibold text-terra-dark">{initials}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">{c.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {t.types[c.type as "coach" | "nutrition"]} · {t.phases[c.phase as keyof typeof t.phases]}
                        {c.goal ? ` · ${c.goal}` : ""}
                      </span>
                    </span>
                    {w != null && (
                      <span className="hidden text-right text-sm sm:block">
                        <span className="block text-xs uppercase tracking-wide text-muted-foreground">{t.last}</span>
                        <span className="font-semibold text-ink">{w.toFixed(1)} kg</span>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <AddClientForm lang={lang} t={t} />
      </div>
    </PortalShell>
  );
}
