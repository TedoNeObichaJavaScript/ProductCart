const LOCALE_TO_INTL: Record<string, string> = {
  bg: "bg-BG",
  en: "en-US",
};

function intlLocale(locale: string): string {
  return LOCALE_TO_INTL[locale] ?? locale;
}

export function formatCurrency(
  value: number,
  locale = "bg",
  currency = "BGN",
): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(
  value: number,
  locale = "bg",
  maximumFractionDigits = 2,
): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    maximumFractionDigits,
  }).format(value);
}
