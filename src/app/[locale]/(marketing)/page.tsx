import { setRequestLocale } from "next-intl/server";

import { CtaSection } from "@/components/marketing/cta-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { Hero } from "@/components/marketing/hero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
