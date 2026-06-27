import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { InventoryView } from "@/components/inventory/inventory-view";
import { requireUser } from "@/lib/session";
import { getActiveOrg } from "@/server/org";
import { listCategories, listProducts } from "@/server/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: "bg" | "en" };
  const t = await getTranslations({ locale, namespace: "Inventory" });
  return { title: t("title") };
}

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: "bg" | "en" };
  setRequestLocale(locale);

  const user = await requireUser();
  const org = await getActiveOrg(user.id, user.name);
  const [products, categories] = await Promise.all([
    listProducts(org.id),
    listCategories(org.id),
  ]);

  return (
    <InventoryView
      products={products}
      categories={categories}
      locale={locale}
    />
  );
}
