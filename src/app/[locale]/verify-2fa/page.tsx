import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { TwoFactorChallenge } from "@/components/auth/two-factor-challenge";
import { Logo } from "@/components/brand/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isTwoFactorSatisfied, requireUser } from "@/lib/session";
import { signOutAction } from "@/server/actions/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: "bg" | "en" };
  const t = await getTranslations({ locale, namespace: "TwoFactor" });
  return { title: t("challengeTitle") };
}

export default async function VerifyTwoFactorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  setRequestLocale(locale);

  const user = await requireUser();
  if (await isTwoFactorSatisfied(user)) {
    redirect("/dashboard");
  }

  const t = await getTranslations("TwoFactor");
  const tc = await getTranslations("Common");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <Logo href="/" />
      </div>
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>{t("challengeTitle")}</CardTitle>
          <CardDescription>{t("challengeSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TwoFactorChallenge />
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
            >
              {tc("signOut")}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
