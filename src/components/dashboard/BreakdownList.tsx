import type { NamedCount } from "@/lib/dashboard-metrics";
import { PanelEmpty } from "@/components/dashboard/Panel";

const SHADES = [
  "bg-primary",
  "bg-primary/80",
  "bg-primary/60",
  "bg-primary/45",
  "bg-primary/30",
  "bg-primary/20",
];

/**
 * Renders a distribution as share-of-total bars. Percentages are computed from
 * the passed rows, so they always add up to what is actually in the sheet.
 */
export function BreakdownList({
  items,
  total,
  emptyMessage = "No data in the sheet yet.",
  valueSuffix,
}: {
  items: NamedCount[];
  total?: number;
  emptyMessage?: string;
  valueSuffix?: string;
}) {
  if (items.length === 0) return <PanelEmpty message={emptyMessage} />;

  const sum = total ?? items.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const share = sum > 0 ? (item.value / sum) * 100 : 0;
        return (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between gap-4 text-sm">
              <span className="truncate font-medium text-foreground" title={item.name}>
                {item.name}
              </span>
              <span className="whitespace-nowrap text-muted-foreground">
                {item.value.toLocaleString()}
                {valueSuffix ?? ""} · {share.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full ${SHADES[i % SHADES.length]}`}
                style={{ width: `${Math.max(share, 1)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
