import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/marketing/contact-form";
import { FadeIn } from "@/components/motion/motion-primitives";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: "bg" | "en" };
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
      <FadeIn className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg text-pretty text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <a
            href={`mailto:${t("email")}`}
            className="flex items-center gap-3 transition-colors hover:text-primary"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Mail className="size-4" />
            </span>
            {t("email")}
          </a>
          <a
            href={`tel:${t("phone").replace(/\s/g, "")}`}
            className="flex items-center gap-3 transition-colors hover:text-primary"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Phone className="size-4" />
            </span>
            {t("phone")}
          </a>
          <p className="flex items-center gap-3 text-muted-foreground">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="size-4" />
            </span>
            Sofia, Bulgaria
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardContent className="p-6">
            <ContactForm />
          </CardContent>
        </Card>
      </FadeIn>
    </section>
  );
}
