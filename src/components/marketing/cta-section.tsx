"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { FadeIn } from "@/components/motion/motion-primitives";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function CtaSection() {
  const t = useTranslations("Hero");
  const tc = useTranslations("Common");

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-emerald-700 px-6 py-16 text-center shadow-xl sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]"
          />
          <h2 className="relative text-3xl font-bold tracking-tight text-balance text-primary-foreground sm:text-4xl">
            {tc("tagline")}
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-pretty text-primary-foreground/80">
            {t("subtitle")}
          </p>
          <div className="relative mt-8 flex justify-center">
            <Button asChild size="lg" variant="secondary" className="group">
              <Link href="/sign-in">
                {tc("getStarted")}
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
