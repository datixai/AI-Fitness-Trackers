import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/content/site";
import { getPortal } from "@/content/portal";
import { getUser } from "@/lib/session";
import { Logo } from "@/components/site/Logo";
import { LoginForm } from "@/components/portal/LoginForm";

export const metadata = { title: "Fisicora | Sign in", robots: { index: false } };

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (await getUser()) redirect(`/${lang}/clients`);
  const t = getPortal(lang).login;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-terra-soft/60 to-cream px-4 py-12">
      <div className="w-full max-w-md">
        <Link href={`/${lang}`} className="mb-8 flex justify-center" aria-label="Fisicora">
          <Logo />
        </Link>
        <div className="rounded-[28px] border bg-card p-8 shadow-[0_30px_60px_-40px_rgb(20_33_61/0.4)]">
          <h1 className="text-3xl font-semibold text-ink">{t.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
          <LoginForm lang={lang} t={t} />
        </div>
        <Link href={`/${lang}`} className="mt-6 block text-center text-sm text-muted-foreground hover:text-terra">
          {t.back}
        </Link>
      </div>
    </main>
  );
}
