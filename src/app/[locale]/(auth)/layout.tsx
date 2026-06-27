import { setRequestLocale } from "next-intl/server";

import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  setRequestLocale(locale);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 to-transparent"
      />
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
      <div className="absolute top-6 left-6">
        <Logo />
      </div>
      {children}
    </div>
  );
}
