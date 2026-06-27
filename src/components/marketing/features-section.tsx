"use client";

import {
  Coffee,
  Disc3,
  Gauge,
  Headset,
  MonitorSmartphone,
  Smartphone,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  FadeIn,
  Stagger,
  StaggerItem,
} from "@/components/motion/motion-primitives";
import { Card, CardContent } from "@/components/ui/card";

const VENUES = [
  { key: "bars", icon: Wine },
  { key: "clubs", icon: Disc3 },
  { key: "restaurants", icon: UtensilsCrossed },
  { key: "cafes", icon: Coffee },
] as const satisfies ReadonlyArray<{ key: string; icon: LucideIcon }>;

const TOOLS = [
  { key: "ui", icon: Gauge },
  { key: "os", icon: MonitorSmartphone },
  { key: "mobile", icon: Smartphone },
  { key: "support", icon: Headset },
] as const satisfies ReadonlyArray<{ key: string; icon: LucideIcon }>;

export function FeaturesSection() {
  const t = useTranslations("Features");

  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("venuesTitle")}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          {t("venuesSubtitle")}
        </p>
      </FadeIn>

      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VENUES.map(({ key, icon: Icon }) => (
          <StaggerItem key={key}>
            <Card className="group h-full transition-colors hover:border-primary/40 hover:shadow-md">
              <CardContent className="space-y-3 p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-semibold">{t(`venues.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground">
                  {t(`venues.${key}.description`)}
                </p>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeIn className="mx-auto mt-24 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {t("toolsTitle")}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          {t("toolsSubtitle")}
        </p>
      </FadeIn>

      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map(({ key, icon: Icon }) => (
          <StaggerItem key={key}>
            <div className="h-full rounded-xl border bg-card p-6 transition-colors hover:bg-accent/40">
              <span className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="font-semibold">{t(`tools.${key}.title`)}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t(`tools.${key}.description`)}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
