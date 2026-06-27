import "server-only";

import { db } from "@/lib/db";
import { remainingStock, type StockStatus, stockStatus } from "@/lib/inventory";
import type { Unit } from "@/lib/validations/product";

export type ProductDTO = {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: Unit;
  categoryId: string | null;
  categoryName: string | null;
  totalStock: number;
  usedStock: number;
  wastedStock: number;
  reorderLevel: number;
  remaining: number;
  status: StockStatus;
  createdAt: string;
};

export type CategoryDTO = { id: string; name: string };

type ProductWithCategory = {
  id: string;
  name: string;
  pricePerUnit: unknown;
  unit: Unit;
  categoryId: string | null;
  category: { name: string } | null;
  totalStock: unknown;
  usedStock: unknown;
  wastedStock: unknown;
  reorderLevel: unknown;
  createdAt: Date;
};

function serialize(p: ProductWithCategory): ProductDTO {
  const nums = {
    totalStock: Number(p.totalStock),
    usedStock: Number(p.usedStock),
    wastedStock: Number(p.wastedStock),
    reorderLevel: Number(p.reorderLevel),
  };
  return {
    id: p.id,
    name: p.name,
    pricePerUnit: Number(p.pricePerUnit),
    unit: p.unit,
    categoryId: p.categoryId,
    categoryName: p.category?.name ?? null,
    ...nums,
    remaining: remainingStock(nums),
    status: stockStatus(nums),
    createdAt: p.createdAt.toISOString(),
  };
}

export async function listProducts(orgId: string): Promise<ProductDTO[]> {
  const products = await db.product.findMany({
    where: { orgId },
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return products.map(serialize);
}

export async function listCategories(orgId: string): Promise<CategoryDTO[]> {
  return db.category.findMany({
    where: { orgId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export type DashboardStats = {
  productCount: number;
  totalStock: number;
  lowStock: number;
  wastage: number;
};

export async function getDashboardStats(
  orgId: string,
): Promise<DashboardStats> {
  const products = await listProducts(orgId);
  return {
    productCount: products.length,
    totalStock: products.reduce((sum, p) => sum + p.remaining, 0),
    lowStock: products.filter((p) => p.status !== "ok").length,
    wastage: products.reduce((sum, p) => sum + p.wastedStock, 0),
  };
}
