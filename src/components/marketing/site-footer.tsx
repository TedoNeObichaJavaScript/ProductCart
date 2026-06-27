"use client";

import { useTranslations } from "next-intl";

import { Logo } from "@/components/brand/logo";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const tn = useTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            {t("rights")}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-foreground">{t("product")}</p>
          <Link
            href="/#features"
            className="block text-muted-foreground transition-colors hover:text-foreground"
          >
            {tn("features")}
          </Link>
          <Link
            href="/faq"
            className="block text-muted-foreground transition-colors hover:text-foreground"
          >
            {tn("faq")}
          </Link>
          <Link
            href="/contact"
            className="block text-muted-foreground transition-colors hover:text-foreground"
          >
            {tn("contact")}
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-foreground">{t("legal")}</p>
          <span className="block text-muted-foreground">{t("privacy")}</span>
          <span className="block text-muted-foreground">{t("terms")}</span>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {year} ProductCart. {t("rights")}
      </div>
    </footer>
  );
}
