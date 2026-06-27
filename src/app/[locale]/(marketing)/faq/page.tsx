import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { FadeIn } from "@/components/motion/motion-primitives";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: "bg" | "en" };
  const t = await getTranslations({ locale, namespace: "Faq" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  setRequestLocale(locale);
  const t = await getTranslations("Faq");

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <FadeIn className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <FaqAccordion />
      </FadeIn>
    </section>
  );
}
