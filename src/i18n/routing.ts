import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Bulgarian (the product's home market) and English.
  locales: ["bg", "en"],
  defaultLocale: "bg",
  // Keep the default locale clean: /about instead of /bg/about.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
