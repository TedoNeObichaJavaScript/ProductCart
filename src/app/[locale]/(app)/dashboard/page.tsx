import { ArrowRight, Boxes, Scale, Trash2, TriangleAlert } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/inventory/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { getActiveOrg } from "@/server/org";
import { getDashboardStats, listProducts } from "@/server/products";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  setRequestLocale(locale);

  const user = await requireUser();
  const org = await getActiveOrg(user.id, user.name);
  const [stats, products] = await Promise.all([
    getDashboardStats(org.id),
    listProducts(org.id),
  ]);

  const t = await getTranslations("Dashboard");
  const ti = await getTranslations("Inventory");
  const recent = products.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("welcome", { name: user.name ?? "" })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Boxes}
          label={t("stats.products")}
          value={formatNumber(stats.productCount, locale, 0)}
        />
        <StatCard
          icon={Scale}
          label={t("stats.totalStock")}
          value={formatNumber(stats.totalStock, locale)}
          accent="text-sky-600 bg-sky-500/10 dark:text-sky-400"
        />
        <StatCard
          icon={TriangleAlert}
          label={t("stats.lowStock")}
          value={formatNumber(stats.lowStock, locale, 0)}
          accent="text-amber-600 bg-amber-500/10 dark:text-amber-400"
        />
        <StatCard
          icon={Trash2}
          label={t("stats.wastage")}
          value={formatNumber(stats.wastage, locale)}
          accent="text-rose-600 bg-rose-500/10 dark:text-rose-400"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{ti("title")}</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/inventory">
              {ti("addProduct")}
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <p>{ti("empty.description")}</p>
              <Button asChild className="mt-4">
                <Link href="/inventory">{ti("empty.cta")}</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.categoryName ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {formatNumber(p.remaining, locale)}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
