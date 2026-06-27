"use client";

import {
  Boxes,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function DashboardNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const tNav = useTranslations("Nav");
  const tInv = useTranslations("Inventory");

  const items: { href: string; icon: LucideIcon; label: string }[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: tNav("dashboard") },
    { href: "/inventory", icon: Boxes, label: tInv("title") },
    { href: "/settings", icon: Settings, label: tNav("settings") },
  ];

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
