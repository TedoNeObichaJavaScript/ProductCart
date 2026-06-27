import { Boxes, TrendingDown, TriangleAlert } from "lucide-react";

const STATS = [
  { icon: Boxes, label: "Products", value: "128", tone: "text-primary" },
  {
    icon: TriangleAlert,
    label: "Low stock",
    value: "6",
    tone: "text-amber-500",
  },
  {
    icon: TrendingDown,
    label: "Wastage",
    value: "3.2kg",
    tone: "text-rose-500",
  },
];

const ROWS = [
  { name: "Chicken breast", cat: "Meat", remaining: "18.5 kg", pct: 74 },
  { name: "Mozzarella", cat: "Dairy", remaining: "9.0 kg", pct: 45 },
  { name: "Tomatoes", cat: "Vegetables", remaining: "2.1 kg", pct: 12 },
  { name: "Espresso beans", cat: "Café", remaining: "24.0 kg", pct: 88 },
];

export function DashboardPreview() {
  return (
    <div className="relative rounded-2xl border border-border/70 bg-card/70 p-4 shadow-2xl backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-1.5">
        <span className="size-3 rounded-full bg-rose-400/80" />
        <span className="size-3 rounded-full bg-amber-400/80" />
        <span className="size-3 rounded-full bg-emerald-400/80" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border bg-muted/50 p-3">
            <s.icon className={`mb-2 size-4 ${s.tone}`} />
            <p className="text-xl font-semibold tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {ROWS.map((r) => (
          <div
            key={r.name}
            className="flex items-center gap-3 rounded-lg border bg-background/60 p-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.cat}</p>
            </div>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${r.pct}%` }}
              />
            </div>
            <span className="w-16 text-right text-xs text-muted-foreground tabular-nums">
              {r.remaining}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
