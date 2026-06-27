"use client";

import { PackageOpen, Plus, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { FadeIn } from "@/components/motion/motion-primitives";
import { ProductFormDialog } from "@/components/inventory/product-form-dialog";
import { ProductTable } from "@/components/inventory/product-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CategoryDTO, ProductDTO } from "@/server/products";
import { useInventoryUI } from "@/stores/inventory-ui";

export function InventoryView({
  products,
  categories,
  locale,
}: {
  products: ProductDTO[];
  categories: CategoryDTO[];
  locale: string;
}) {
  const t = useTranslations("Inventory");
  const { search, setSearch, openCreate } = useInventoryUI();

  const query = search.trim().toLowerCase();
  const filtered = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.categoryName ?? "").toLowerCase().includes(query),
      )
    : products;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          {t("addProduct")}
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState onAdd={openCreate} />
      ) : (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("table.name")}
              className="pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {t("empty.title")}
            </p>
          ) : (
            <FadeIn>
              <ProductTable products={filtered} locale={locale} />
            </FadeIn>
          )}
        </>
      )}

      <ProductFormDialog categories={categories} />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  const t = useTranslations("Inventory.empty");
  return (
    <FadeIn className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-20 text-center">
      <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <PackageOpen className="size-7" />
      </span>
      <h3 className="text-lg font-semibold">{t("title")}</h3>
      <p className="mt-1 max-w-sm text-sm text-pretty text-muted-foreground">
        {t("description")}
      </p>
      <Button className="mt-6" onClick={onAdd}>
        <Plus className="size-4" />
        {t("cta")}
      </Button>
    </FadeIn>
  );
}
