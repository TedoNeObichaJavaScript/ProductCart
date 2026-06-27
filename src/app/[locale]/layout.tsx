import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AppProviders } from "@/components/providers/app-providers";
import { routing } from "@/i18n/routing";

import "../globals.css";

// Inter supports both Latin and Cyrillic — essential for Bulgarian copy.
const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: "bg" | "en" };
  const t = await getTranslations({ locale, namespace: "Common" });
  const tHero = await getTranslations({ locale, namespace: "Hero" });

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ),
    title: {
      default: `${t("appName")} — ${t("tagline")}`,
      template: `%s · ${t("appName")}`,
    },
    description: tHero("subtitle"),
    applicationName: t("appName"),
    openGraph: {
      title: `${t("appName")} — ${t("tagline")}`,
      description: tHero("subtitle"),
      type: "website",
      locale,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
