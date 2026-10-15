import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/content/site";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { ProductPreview } from "@/components/site/ProductPreview";
import { HowItWorks } from "@/components/site/HowItWorks";
import { FeatureTabs } from "@/components/site/FeatureTabs";
import { Audience } from "@/components/site/Audience";
import { Pricing } from "@/components/site/Pricing";
import { Faq } from "@/components/site/Faq";
import { DemoForm } from "@/components/site/DemoForm";
import { Footer } from "@/components/site/Footer";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <Navbar t={t.nav} lang={lang} />
      <main>
        <Hero t={t.hero} lang={lang} />
        <ProductPreview t={t.preview} lang={lang} />
        <HowItWorks t={t.how} />
        <FeatureTabs t={t.features} lang={lang} />
        <Audience t={t.who} />
        <Pricing t={t.pricing} />
        <Faq t={t.faq} />
        <DemoForm t={t.demo} />
      </main>
      <Footer t={t.footer} />
    </>
  );
}
