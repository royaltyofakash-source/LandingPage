import type { TooltipProps } from "recharts";

/** Shared recharts styling so every chart picks up the app's theme tokens. */
export const chartAxis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export const chartGrid = {
  strokeDasharray: "3 3",
  stroke: "var(--border)",
  vertical: false,
} as const;

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: TooltipProps<number, string> & { valueFormatter?: (value: number) => string }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs text-muted-foreground">
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}:{" "}
          <span className="font-medium text-foreground">
            {valueFormatter
              ? valueFormatter(Number(entry.value))
              : Number(entry.value).toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
}
