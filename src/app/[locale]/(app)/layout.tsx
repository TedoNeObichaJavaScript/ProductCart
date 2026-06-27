import { setRequestLocale } from "next-intl/server";

import { Logo } from "@/components/brand/logo";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { requireUser } from "@/lib/session";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  setRequestLocale(locale);

  // Guards every route in this group — redirects to /sign-in when signed out.
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/20 md:flex">
        <div className="flex h-16 items-center border-b px-5">
          <Logo href="/dashboard" />
        </div>
        <DashboardNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          user={{ name: user.name, email: user.email, image: user.image }}
        />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
