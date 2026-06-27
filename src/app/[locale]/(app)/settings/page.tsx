import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TwoFactorCard } from "@/components/dashboard/two-factor-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: "bg" | "en" };
  const t = await getTranslations({ locale, namespace: "Settings" });
  return { title: t("title") };
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  setRequestLocale(locale);

  const user = await requireUser();
  const t = await getTranslations("Settings");

  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile.title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="size-14">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name ?? ""} />
            ) : null}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 text-sm">
            <p className="truncate font-medium">{user.name ?? "—"}</p>
            <p className="truncate text-muted-foreground">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <TwoFactorCard enabled={Boolean(user.twoFactorEnabled)} />
    </div>
  );
}
