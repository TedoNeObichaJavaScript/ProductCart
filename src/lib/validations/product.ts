import { z } from "zod";

export const UNITS = ["KG", "L", "PCS"] as const;
export const unitSchema = z.enum(UNITS);
export type Unit = (typeof UNITS)[number];

const stock = () =>
  z
    .number({ error: "Enter a valid number" })
    .nonnegative("Cannot be negative")
    .max(10_000_000);

export const productSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    pricePerUnit: z
      .number({ error: "Enter a valid price" })
      .nonnegative("Price cannot be negative")
      .max(1_000_000),
    unit: unitSchema,
    categoryId: z.string().min(1).nullable().optional(),
    newCategory: z.string().trim().max(60).optional(),
    totalStock: stock(),
    usedStock: stock(),
    wastedStock: stock(),
    reorderLevel: stock(),
  })
  .refine((d) => d.usedStock + d.wastedStock <= d.totalStock, {
    message: "Used + wasted stock cannot exceed total stock",
    path: ["usedStock"],
  });

export type ProductInput = z.infer<typeof productSchema>;

export const productIdSchema = z.object({ id: z.string().min(1) });
