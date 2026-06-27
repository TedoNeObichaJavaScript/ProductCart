"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/inventory/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/format";
import { unitLabel } from "@/lib/inventory";
import { deleteProduct } from "@/server/actions/products";
import type { ProductDTO } from "@/server/products";
import { useInventoryUI } from "@/stores/inventory-ui";

export function ProductTable({
  products,
  locale,
}: {
  products: ProductDTO[];
  locale: string;
}) {
  const t = useTranslations("Inventory");
  const tc = useTranslations("Common");
  const openEdit = useInventoryUI((s) => s.openEdit);
  const router = useRouter();
  const [target, setTarget] = useState<ProductDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    const result = await deleteProduct(target.id);
    setDeleting(false);
    if (result.ok) {
      toast.success(t("toasts.deleted"));
      router.refresh();
    } else {
      toast.error(t("toasts.error"));
    }
    setTarget(null);
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.price")}</TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("table.category")}
              </TableHead>
              <TableHead className="text-right">
                {t("table.remaining")}
              </TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatCurrency(p.pricePerUnit, locale)}
                  <span className="text-xs">/{unitLabel(p.unit)}</span>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {p.categoryName ?? "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(p.remaining, locale)} {unitLabel(p.unit)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("editProduct")}
                      onClick={() => openEdit(p)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("table.actions")}
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setTarget(p)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("editProduct")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDelete", { name: target?.name ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              {tc("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {tc("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
