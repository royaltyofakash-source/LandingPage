import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Reveal } from "@/components/landing/Reveal";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { Panel, PanelEmpty } from "@/components/dashboard/Panel";
import { BreakdownList } from "@/components/dashboard/BreakdownList";
import { ChartTooltip, chartAxis, chartGrid } from "@/components/dashboard/chart-theme";
import { formatCurrency, formatDateRange, isoDate } from "@/lib/dashboard-metrics";

function ChartSkeleton() {
  return <div className="h-full min-h-[260px] w-full animate-pulse rounded-lg bg-muted/60" />;
}

export function DashboardContent() {
  const { metrics, rows, isLoading } = useDashboardMetrics();

  // "Recent" = newest capture timestamp, not sheet row order.
  const recentLeads = rows
    ? [...rows]
        .filter((row) => isoDate(row["Date Captured"]))
        .sort((a, b) => (b["Date Captured"] ?? "").localeCompare(a["Date Captured"] ?? ""))
        .slice(0, 6)
    : [];

  const funnel = [
    { label: "Leads captured", value: metrics.totalLeads },
    { label: "Synced to Close CRM", value: metrics.leadsInCrm },
    { label: "Calls booked", value: metrics.bookedCalls },
    { label: "Deals closed", value: metrics.closedDeals },
  ];

  return (
    <>
      <div className="mt-6 grid gap-6 lg:grid-cols-7">
        <Reveal delay={500} className="lg:col-span-4">
          <Panel
            title="Lead Flow"
            description={
              isLoading
                ? "Loading lead history…"
                : formatDateRange(metrics.firstLeadDate, metrics.lastLeadDate)
            }
            bodyClassName="min-h-[280px]"
          >
            {isLoading ? (
              <ChartSkeleton />
            ) : metrics.leadsByDay.length === 0 ? (
              <PanelEmpty message="No dated leads in the sheet." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={metrics.leadsByDay}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="leadFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...chartGrid} />
                  <XAxis dataKey="label" {...chartAxis} interval="preserveStartEnd" />
                  <YAxis {...chartAxis} width={44} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)" }} />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    name="Leads captured"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#leadFlow)"
                  />
                  <Line
                    type="monotone"
                    dataKey="bookedCalls"
                    name="Calls booked"
                    stroke="var(--foreground)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Panel>
        </Reveal>

        <Reveal delay={600} className="lg:col-span-3">
          <Panel title="Recent Signups" description="Newest leads by capture date">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded bg-muted/60" />
                ))}
              </div>
            ) : recentLeads.length === 0 ? (
              <PanelEmpty message="No leads found." />
            ) : (
              <div className="space-y-5">
                {recentLeads.map((lead, i) => {
                  const cash = Number(lead["Cash_Collected_USD"]?.replace(/[^0-9.-]/g, "") || 0);
                  const hasCash = Number.isFinite(cash) && cash > 0;
                  const capturedOn = isoDate(lead["Date Captured"]);

                  return (
                    <div key={`${lead["Email"]}-${i}`} className="flex items-center">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                        {(lead["Lead Name"] || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4 space-y-1 overflow-hidden">
                        <p className="truncate text-sm font-medium leading-none text-foreground">
                          {lead["Lead Name"] || "Unnamed lead"}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {lead["Email"] || "No email"}
                        </p>
                      </div>
                      <div className="ml-auto flex flex-col items-end whitespace-nowrap pl-2 text-sm font-medium">
                        {hasCash ? (
                          <span className="text-emerald-500">+{formatCurrency(cash, 2)}</span>
                        ) : (
                          <span className="text-xs font-normal text-muted-foreground">
                            {capturedOn ?? "No date"}
                          </span>
                        )}
                        {lead["Lead Grade"] && (
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Grade {lead["Lead Grade"]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </Reveal>
      </div>

      {/* Stretches to the bottom of the viewport so the page never ends short */}
      <div className="mt-6 grid flex-1 gap-6 lg:grid-cols-3">
        <Reveal delay={700}>
          <Panel title="Conversion Funnel" description="Each stage as recorded in the sheet">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <div className="space-y-4">
                {funnel.map((stage) => {
                  const share =
                    metrics.totalLeads > 0 ? (stage.value / metrics.totalLeads) * 100 : 0;
                  return (
                    <div key={stage.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{stage.label}</span>
                        <span className="text-muted-foreground">
                          {stage.value.toLocaleString()} · {share.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.max(share, 0.8)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </Reveal>

        <Reveal delay={800}>
          <Panel
            title="Lead Quality"
            description={
              isLoading
                ? "Loading lead scores…"
                : metrics.avgLeadScore === null
                  ? "No scored leads"
                  : `Avg score ${metrics.avgLeadScore.toFixed(2)} across ${metrics.scoredLeads.toLocaleString()} scored leads`
            }
          >
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <BreakdownList
                items={metrics.gradeDistribution.map((grade) => ({
                  ...grade,
                  name: `Grade ${grade.name}`,
                }))}
                emptyMessage="No graded leads in the sheet."
              />
            )}
          </Panel>
        </Reveal>

        <Reveal delay={900}>
          <Panel title="Top Campaigns" description="Leads by UTM campaign">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <BreakdownList
                items={metrics.topCampaigns}
                total={metrics.totalLeads}
                emptyMessage="No campaign tags in the sheet."
              />
            )}
          </Panel>
        </Reveal>
      </div>
    </>
  );
}
