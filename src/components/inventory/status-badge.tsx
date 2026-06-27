import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { StockStatus } from "@/lib/inventory";
import { cn } from "@/lib/utils";

const STYLES: Record<StockStatus, string> = {
  ok: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  low: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  out: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function StatusBadge({ status }: { status: StockStatus }) {
  const t = useTranslations("Inventory.status");
  return (
    <Badge variant="outline" className={cn("font-medium", STYLES[status])}>
      {t(status)}
    </Badge>
  );
}
