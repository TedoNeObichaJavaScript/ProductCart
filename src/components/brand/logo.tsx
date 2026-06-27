import { ShoppingBasket } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
      aria-label="ProductCart"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <ShoppingBasket className="size-5" />
      </span>
      <span className="text-lg">
        Product<span className="text-primary">Cart</span>
      </span>
    </Link>
  );
}
