import type { Unit } from "@/lib/validations/product";

export type StockStatus = "ok" | "low" | "out";

export type StockLike = {
  totalStock: number;
  usedStock: number;
  wastedStock: number;
  reorderLevel: number;
};

/** Remaining = total − used − wasted, floored at 0. */
export function remainingStock(p: StockLike): number {
  return Math.max(0, p.totalStock - p.usedStock - p.wastedStock);
}

export function stockStatus(p: StockLike): StockStatus {
  const remaining = remainingStock(p);
  if (remaining <= 0) return "out";
  if (remaining <= p.reorderLevel) return "low";
  return "ok";
}

const UNIT_LABEL: Record<Unit, string> = {
  KG: "kg",
  L: "l",
  PCS: "pcs",
};

export function unitLabel(unit: Unit): string {
  return UNIT_LABEL[unit] ?? unit;
}
