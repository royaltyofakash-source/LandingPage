import { Database, ExternalLink, RefreshCw } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { formatDateRange } from "@/lib/dashboard-metrics";

/** Live status of the Google Sheet the whole dashboard reads from. */
export function DataSourcePanel() {
  const { metrics, rows, isLoading, isFetching, error, refetch, dataUpdatedAt } =
    useDashboardMetrics();

  const sheetUrl = import.meta.env["VITE_SPREADSHEET_DATA"] as string | undefined;
  const columnCount = rows && rows[0] ? Object.keys(rows[0]).length : 0;

  const status = error ? "Disconnected" : isLoading ? "Connecting…" : "Connected";
  const statusStyle = error
    ? "bg-destructive/10 text-destructive"
    : isLoading
      ? "bg-muted text-muted-foreground"
      : "bg-emerald-500/10 text-emerald-600";

  const facts = [
    { label: "Rows loaded", value: isLoading ? "—" : metrics.totalLeads.toLocaleString() },
    { label: "Columns detected", value: isLoading ? "—" : String(columnCount) },
    {
      label: "Lead date range",
      value: isLoading ? "—" : formatDateRange(metrics.firstLeadDate, metrics.lastLeadDate),
    },
    {
      label: "Last synced",
      value: dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "Not yet synced",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Database className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-medium text-foreground">Google Sheet</h3>
            <p className="text-sm text-muted-foreground">
              Read-only CSV export, cached for 5 minutes
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle}`}>
          {status}
        </span>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {(error as Error).message}
        </p>
      )}

      <dl className="grid gap-4 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-lg border border-border bg-background/40 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {fact.label}
            </dt>
            <dd className="mt-1 font-medium text-foreground">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Source URL
        </p>
        <p className="break-all rounded-lg border border-border bg-background/40 p-3 font-mono text-xs text-muted-foreground">
          {sheetUrl ?? "VITE_SPREADSHEET_DATA is not set"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Syncing…" : "Sync now"}
        </button>
        {sheetUrl && (
          <a
            href={sheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Open spreadsheet
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
