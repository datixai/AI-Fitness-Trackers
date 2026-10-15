import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale } from "@/content/site";
import { getPortal } from "@/content/portal";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { archiveClientAction } from "@/app/actions";
import { PortalShell } from "@/components/portal/PortalShell";
import { AddMeasurementForm, EditClientForm } from "@/components/portal/ClientForms";

export const metadata = { title: "Fisicora | Client", robots: { index: false } };

function Chart({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const max = Math.max(...data) + 0.3;
  const min = Math.min(...data) - 0.3;
  const pts = data.map((w, i) => `${(i / (data.length - 1)) * 600},${10 + ((max - w) / (max - min)) * 150}`).join(" ");
  return (
    <svg viewBox="0 0 600 170" className="h-40 w-full" preserveAspectRatio="none" role="img" aria-label="weight chart">
      <polyline points={pts} fill="none" stroke="var(--terra)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default async function ClientPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const user = await requireUser(lang);
  const p = getPortal(lang);
  const t = p.record;
  const c = p.clients;

  const client = await db.client.findFirst({
    where: { id, ownerId: user.id, archived: false },
    include: { measures: { orderBy: { date: "asc" } } },
  });
  if (!client) notFound();

  const weights = client.measures.map((m) => m.weightKg).filter((w): w is number => w != null);
  const rows = [...client.measures].reverse();

  return (
    <PortalShell lang={lang} user={user} t={p.nav} path={`clients/${id}`}>
      <Link href={`/${lang}/clients`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-terra">
        <ArrowLeft className="h-4 w-4" />
        {t.back}
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-ink">{client.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {c.types[client.type as "coach" | "nutrition"]} · {c.phases[client.phase as keyof typeof c.phases]}
            {client.email ? ` · ${client.email}` : ""}
            {client.phone ? ` · ${client.phone}` : ""}
          </p>
        </div>
        <form action={archiveClientAction}>
          <input type="hidden" name="id" value={client.id} />
          <input type="hidden" name="lang" value={lang} />
          <button className="rounded-full border px-4 py-2 text-sm text-ink-soft hover:border-ink" title={t.confirmArchive}>
            {t.archive}
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-ink">{t.info}</h2>
            <EditClientForm id={client.id} lang={lang} t={t} initial={{ goal: client.goal, allergies: client.allergies, notes: client.notes }} />
          </section>

          <section className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold text-ink">{t.measures}</h2>
            {weights.length > 1 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{t.trend}</p>
                <Chart data={weights} />
              </div>
            )}
            {rows.length === 0 ? (
              <p className="mt-4 text-muted-foreground">{t.noMeasures}</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[420px] text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-4">{t.date}</th>
                      <th className="py-2 pr-4">{t.weight}</th>
                      <th className="py-2 pr-4">{t.bodyFat}</th>
                      <th className="py-2">{t.waist}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((m) => (
                      <tr key={m.id} className="border-t">
                        <td className="py-2.5 pr-4 text-ink">{m.date.toLocaleDateString(lang)}</td>
                        <td className="py-2.5 pr-4">{m.weightKg ?? "-"}</td>
                        <td className="py-2.5 pr-4">{m.bodyFat ?? "-"}</td>
                        <td className="py-2.5">{m.waistCm ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6">
          <AddMeasurementForm id={client.id} lang={lang} t={t} />
        </aside>
      </div>
    </PortalShell>
  );
}
