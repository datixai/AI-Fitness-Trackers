import Link from "next/link";
import { LogOut } from "lucide-react";
import type { Locale } from "@/content/site";
import type { Portal } from "@/content/portal";
import { logoutAction } from "@/app/actions";
import { Logo } from "@/components/site/Logo";

export function PortalShell({
  lang,
  user,
  t,
  path,
  children,
}: {
  lang: Locale;
  user: { name: string; email: string };
  t: Portal["nav"];
  path: string;
  children: React.ReactNode;
}) {
  const other: Locale = lang === "en" ? "it" : "en";
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href={`/${lang}/clients`} aria-label="Fisicora">
            <Logo />
          </Link>
          <nav className="ml-4 hidden gap-1 sm:flex">
            <Link href={`/${lang}/clients`} className="rounded-lg bg-terra-soft px-3 py-1.5 text-sm font-medium text-terra-dark">
              {t.clients}
            </Link>
            <Link href={`/${lang}`} className="rounded-lg px-3 py-1.5 text-sm text-ink-soft hover:bg-sand">
              {t.site}
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href={`/${other}/${path}`} className="rounded-full border px-3 py-1 text-xs font-semibold uppercase text-ink-soft hover:border-ink">
              {other}
            </Link>
            <span className="hidden text-sm text-muted-foreground md:inline">{user.name}</span>
            <form action={logoutAction}>
              <input type="hidden" name="lang" value={lang} />
              <button className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium text-ink hover:border-ink" aria-label={t.logout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
