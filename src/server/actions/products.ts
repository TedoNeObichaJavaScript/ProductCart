"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { productSchema } from "@/lib/validations/product";
import { getActiveOrg } from "@/server/org";

import type { ActionResult } from "./types";

function revalidateInventory() {
  revalidatePath("/[locale]/dashboard", "page");
  revalidatePath("/[locale]/inventory", "page");
}

async function resolveCategoryId(
  orgId: string,
  categoryId?: string | null,
  newCategory?: string,
): Promise<string | null> {
  const name = newCategory?.trim();
  if (name) {
    const category = await db.category.upsert({
      where: { orgId_name: { orgId, name } },
      update: {},
      create: { orgId, name },
    });
    return category.id;
  }
  return categoryId ?? null;
}

export async function createProduct(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const org = await getActiveOrg(user.id, user.name);
    const input = parsed.data;
    const categoryId = await resolveCategoryId(
      org.id,
      input.categoryId,
      input.newCategory,
    );

    const product = await db.product.create({
      data: {
        orgId: org.id,
        name: input.name,
        pricePerUnit: input.pricePerUnit,
        unit: input.unit,
        categoryId,
        totalStock: input.totalStock,
        usedStock: input.usedStock,
        wastedStock: input.wastedStock,
        reorderLevel: input.reorderLevel,
        movements: {
          create: [
            ...(input.totalStock > 0
              ? [
                  {
                    orgId: org.id,
                    userId: user.id,
                    type: "RESTOCK" as const,
                    quantity: input.totalStock,
                  },
                ]
              : []),
            ...(input.usedStock > 0
              ? [
                  {
                    orgId: org.id,
                    userId: user.id,
                    type: "USAGE" as const,
                    quantity: input.usedStock,
                  },
                ]
              : []),
            ...(input.wastedStock > 0
              ? [
                  {
                    orgId: org.id,
                    userId: user.id,
                    type: "WASTAGE" as const,
                    quantity: input.wastedStock,
                  },
                ]
              : []),
          ],
        },
      },
    });

    revalidateInventory();
    return { ok: true, data: { id: product.id } };
  } catch (error) {
    console.error("createProduct failed", error);
    return { ok: false, error: "Could not create the product" };
  }
}

export async function updateProduct(
  id: string,
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const org = await getActiveOrg(user.id, user.name);
    const existing = await db.product.findFirst({
      where: { id, orgId: org.id },
      select: { id: true },
    });
    if (!existing) {
      return { ok: false, error: "Product not found" };
    }

    const input = parsed.data;
    const categoryId = await resolveCategoryId(
      org.id,
      input.categoryId,
      input.newCategory,
    );

    await db.product.update({
      where: { id },
      data: {
        name: input.name,
        pricePerUnit: input.pricePerUnit,
        unit: input.unit,
        categoryId,
        totalStock: input.totalStock,
        usedStock: input.usedStock,
        wastedStock: input.wastedStock,
        reorderLevel: input.reorderLevel,
        movements: {
          create: {
            orgId: org.id,
            userId: user.id,
            type: "ADJUSTMENT",
            quantity: input.totalStock,
            note: "Edited from inventory",
          },
        },
      },
    });

    revalidateInventory();
    return { ok: true, data: { id } };
  } catch (error) {
    console.error("updateProduct failed", error);
    return { ok: false, error: "Could not update the product" };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const user = await requireUser();
  try {
    const org = await getActiveOrg(user.id, user.name);
    const result = await db.product.deleteMany({
      where: { id, orgId: org.id },
    });
    if (result.count === 0) {
      return { ok: false, error: "Product not found" };
    }
    revalidateInventory();
    return { ok: true };
  } catch (error) {
    console.error("deleteProduct failed", error);
    return { ok: false, error: "Could not delete the product" };
  }
}
