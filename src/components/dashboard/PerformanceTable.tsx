import type { ChannelPerformance } from "@/lib/dashboard-metrics";
import { formatCurrency, formatPercent } from "@/lib/dashboard-metrics";
import { PanelEmpty } from "@/components/dashboard/Panel";

/** Leads → calls → deals → cash for a channel, all straight from the sheet. */
export function PerformanceTable({
  rows,
  label,
  emptyMessage,
}: {
  rows: ChannelPerformance[];
  label: string;
  emptyMessage: string;
}) {
  if (rows.length === 0) return <PanelEmpty message={emptyMessage} />;

  return (
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full min-w-125 text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <th className="px-2 py-3 text-left">{label}</th>
            <th className="px-2 py-3 text-right">Leads</th>
            <th className="px-2 py-3 text-right">Calls</th>
            <th className="px-2 py-3 text-right">Closed</th>
            <th className="px-2 py-3 text-right">Book rate</th>
            <th className="px-2 py-3 text-right">Cash</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.name} className="transition-colors hover:bg-accent/40">
              <td
                className="max-w-75 truncate px-2 py-3 font-medium text-foreground"
                title={row.name}
              >
                {row.name}
              </td>
              <td className="px-2 py-3 text-right text-muted-foreground">
                {row.leads.toLocaleString()}
              </td>
              <td className="px-2 py-3 text-right text-muted-foreground">
                {row.bookedCalls.toLocaleString()}
              </td>
              <td className="px-2 py-3 text-right text-muted-foreground">
                {row.closed.toLocaleString()}
              </td>
              <td className="px-2 py-3 text-right text-muted-foreground">
                {row.leads > 0 ? formatPercent((row.bookedCalls / row.leads) * 100) : "—"}
              </td>
              <td className="px-2 py-3 text-right font-medium">
                {row.revenue > 0 ? (
                  <span className="text-emerald-600">{formatCurrency(row.revenue)}</span>
                ) : (
                  <span className="text-muted-foreground/40">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
