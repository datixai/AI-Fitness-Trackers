import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/content/site";
import { DemoApp } from "@/components/app/DemoApp";

export const metadata: Metadata = {
  title: "Fisicora | Live demo",
  robots: { index: false },
};

export default async function AppPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <DemoApp lang={lang} />;
}
