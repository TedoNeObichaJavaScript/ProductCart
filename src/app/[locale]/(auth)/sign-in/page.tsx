import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { OAuthButton } from "@/components/auth/oauth-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { signInWithGithub, signInWithGoogle } from "@/server/actions/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: "bg" | "en" };
  const t = await getTranslations({ locale, namespace: "Auth" });
  return { title: t("signInTitle") };
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.59.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M12.24 10.4V14.4h5.66c-.25 1.46-1.74 4.28-5.66 4.28-3.4 0-6.18-2.82-6.18-6.28s2.78-6.28 6.18-6.28c1.94 0 3.24.83 3.98 1.54l2.72-2.62C17.18 2.96 14.94 2 12.24 2 6.98 2 2.72 6.26 2.72 11.5S6.98 21 12.24 21c5.5 0 9.14-3.86 9.14-9.3 0-.62-.07-1.1-.16-1.58z"
      />
    </svg>
  );
}

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  const t = await getTranslations("Auth");

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("signInTitle")}</CardTitle>
        <CardDescription>{t("signInSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form action={signInWithGoogle}>
          <OAuthButton>
            <GoogleIcon />
            {t("continueWithGoogle")}
          </OAuthButton>
        </form>
        <form action={signInWithGithub}>
          <OAuthButton>
            <GithubIcon />
            {t("continueWithGithub")}
          </OAuthButton>
        </form>
        <p className="pt-2 text-center text-xs text-balance text-muted-foreground">
          {t("termsNotice")}
        </p>
      </CardContent>
    </Card>
  );
}
