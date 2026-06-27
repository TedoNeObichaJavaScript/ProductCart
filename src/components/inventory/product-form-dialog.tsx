"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { remainingStock } from "@/lib/inventory";
import {
  type ProductInput,
  productSchema,
  UNITS,
} from "@/lib/validations/product";
import { createProduct, updateProduct } from "@/server/actions/products";
import type { CategoryDTO } from "@/server/products";
import { useInventoryUI } from "@/stores/inventory-ui";

const NEW_CATEGORY = "__new__";
const NO_CATEGORY = "__none__";

const BLANK: ProductInput = {
  name: "",
  pricePerUnit: 0,
  unit: "KG",
  categoryId: null,
  newCategory: "",
  totalStock: 0,
  usedStock: 0,
  wastedStock: 0,
  reorderLevel: 0,
};

export function ProductFormDialog({
  categories,
}: {
  categories: CategoryDTO[];
}) {
  const t = useTranslations("Inventory");
  const tc = useTranslations("Common");
  const router = useRouter();
  const { dialogOpen, editing, closeDialog } = useInventoryUI();

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: BLANK,
  });

  useEffect(() => {
    if (!dialogOpen) return;
    form.reset(
      editing
        ? {
            name: editing.name,
            pricePerUnit: editing.pricePerUnit,
            unit: editing.unit,
            categoryId: editing.categoryId,
            newCategory: "",
            totalStock: editing.totalStock,
            usedStock: editing.usedStock,
            wastedStock: editing.wastedStock,
            reorderLevel: editing.reorderLevel,
          }
        : BLANK,
    );
  }, [dialogOpen, editing, form]);

  const [total, used, wasted, categoryValue] = useWatch({
    control: form.control,
    name: ["totalStock", "usedStock", "wastedStock", "categoryId"],
  });
  const remaining = remainingStock({
    totalStock: Number(total) || 0,
    usedStock: Number(used) || 0,
    wastedStock: Number(wasted) || 0,
    reorderLevel: 0,
  });

  const showNewCategory = categoryValue === NEW_CATEGORY;

  async function onSubmit(values: ProductInput) {
    const payload: ProductInput = {
      ...values,
      categoryId:
        values.categoryId === NEW_CATEGORY || values.categoryId === NO_CATEGORY
          ? null
          : values.categoryId,
    };

    const result = editing
      ? await updateProduct(editing.id, payload)
      : await createProduct(payload);

    if (result.ok) {
      toast.success(editing ? t("toasts.updated") : t("toasts.created"));
      closeDialog();
      router.refresh();
    } else if (result.fieldErrors) {
      for (const [key, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          form.setError(key as keyof ProductInput, { message: messages[0] });
        }
      }
    } else {
      toast.error(t("toasts.error"));
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? t("editProduct") : t("newProduct")}
          </DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("fields.namePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricePerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.price")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.unit")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UNITS.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.category")}</FormLabel>
                  <Select
                    value={field.value ?? NO_CATEGORY}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_CATEGORY}>—</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                      <SelectItem value={NEW_CATEGORY}>
                        + {t("fields.category")}…
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showNewCategory && (
              <FormField
                control={form.control}
                name="newCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder={t("fields.category")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  "totalStock",
                  "usedStock",
                  "wastedStock",
                  "reorderLevel",
                ] as const
              ).map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(`fields.${fieldKey(name)}`)}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.001"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm">
              <span className="text-muted-foreground">
                {t("fields.remainingStock")}
              </span>
              <span className="text-lg font-semibold tabular-nums">
                {Number.isFinite(remaining) ? remaining : 0}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={closeDialog}
                disabled={isSubmitting}
              >
                {tc("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {editing ? tc("update") : tc("add")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function fieldKey(
  name: string,
): "totalStock" | "usedStock" | "wastage" | "reorderLevel" {
  switch (name) {
    case "totalStock":
      return "totalStock";
    case "usedStock":
      return "usedStock";
    case "wastedStock":
      return "wastage";
    case "reorderLevel":
      return "reorderLevel";
    default:
      return "totalStock";
  }
}
