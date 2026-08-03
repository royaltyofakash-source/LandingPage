import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Reveal } from "@/components/landing/Reveal";
import { BarChart3, TrendingUp, DollarSign, Target, Receipt } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { DataError, Panel, PanelEmpty, StatCard } from "@/components/dashboard/Panel";
import { BreakdownList } from "@/components/dashboard/BreakdownList";
import { PerformanceTable } from "@/components/dashboard/PerformanceTable";
import { ChartTooltip, chartAxis, chartGrid } from "@/components/dashboard/chart-theme";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/lib/dashboard-metrics";

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [{ title: "Analytics - Transformation Hub" }],
  }),
});

function AnalyticsPage() {
  const { metrics, isLoading, error } = useDashboardMetrics();

  const cards = [
    {
      title: "Cash Collected",
      value: formatCurrency(metrics.totalRevenue, 2),
      hint: `Across ${metrics.payingCustomers.toLocaleString()} payments`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Average Deal Size",
      value: formatCurrency(metrics.avgDealSize, 2),
      hint: `${formatCurrency(metrics.revenuePerLead, 2)} revenue per lead`,
      icon: <Receipt className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Booking Rate",
      value: formatPercent(metrics.bookingRate),
      hint: `${metrics.bookedCalls.toLocaleString()} of ${metrics.totalLeads.toLocaleString()} leads booked a call`,
      icon: <Target className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Close Rate",
      value: formatPercent(metrics.closeRate),
      hint: `${metrics.closedDeals.toLocaleString()} deals closed from booked calls`,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const totalGraded = metrics.gradeDistribution.reduce((acc, g) => acc + g.value, 0);

  return (
    <div className="flex w-full flex-1 flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 space-y-2 sm:mb-8">
        <Reveal delay={0}>
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-foreground sm:gap-3 sm:text-3xl">
            <BarChart3 className="h-7 w-7 shrink-0 text-primary sm:h-8 sm:w-8" />
            Analytics
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-muted-foreground">
            Detailed breakdown of your revenue and student engagement.
          </p>
        </Reveal>
      </div>

      {error ? (
        <DataError message={(error as Error).message} />
      ) : (
        <>
          <div className="mb-4 grid gap-4 sm:mb-6 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {cards.map((card, i) => (
              <Reveal key={card.title} delay={200 + i * 100}>
                <StatCard {...card} isLoading={isLoading} />
              </Reveal>
            ))}
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <Reveal delay={500} className="lg:col-span-2">
              <Panel
                title="Revenue Over Time"
                description="Cash collected per month, dated by deal creation in Close"
                bodyClassName="h-60 sm:h-75"
              >
                {isLoading ? (
                  <div className="h-60 w-full animate-pulse rounded-lg bg-muted/60 sm:h-75" />
                ) : metrics.revenueByMonth.length === 0 ? (
                  <PanelEmpty message="No cash collected recorded in the sheet." />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metrics.revenueByMonth}
                      margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                    >
                      <CartesianGrid {...chartGrid} />
                      <XAxis dataKey="label" {...chartAxis} interval="preserveStartEnd" />
                      <YAxis
                        {...chartAxis}
                        width={52}
                        tickFormatter={(value: number) => formatCompactCurrency(value)}
                      />
                      <Tooltip
                        cursor={{ fill: "var(--accent)", opacity: 0.4 }}
                        content={
                          <ChartTooltip
                            valueFormatter={(value: number) => formatCurrency(value, 2)}
                          />
                        }
                      />
                      <Bar
                        dataKey="revenue"
                        name="Cash collected"
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={48}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Panel>
            </Reveal>

            <Reveal delay={600}>
              <Panel title="Program Mix" description="Revenue split by program purchased">
                {isLoading ? (
                  <div className="h-60 w-full animate-pulse rounded-lg bg-muted/60" />
                ) : metrics.programTypes.length === 0 ? (
                  <PanelEmpty message="No program types recorded." />
                ) : (
                  <div className="space-y-5">
                    {metrics.programTypes.map((program) => {
                      const share =
                        metrics.totalRevenue > 0
                          ? (program.revenue / metrics.totalRevenue) * 100
                          : 0;
                      return (
                        <div key={program.name} className="space-y-2">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-sm font-medium text-foreground">
                              {program.name}
                            </span>
                            <span className="font-display text-sm font-bold text-foreground">
                              {formatCurrency(program.revenue)}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.max(share, 1)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {program.deals} {program.deals === 1 ? "sale" : "sales"} ·{" "}
                            {share.toFixed(1)}% of revenue
                          </p>
                        </div>
                      );
                    })}

                    {metrics.paymentTypes.length > 0 && (
                      <div className="border-t border-border pt-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Payment types
                        </p>
                        <div className="space-y-2">
                          {metrics.paymentTypes.map((payment) => (
                            <div key={payment.name} className="flex justify-between gap-3 text-sm">
                              <span className="truncate text-muted-foreground">{payment.name}</span>
                              <span className="font-medium text-foreground">{payment.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Panel>
            </Reveal>
          </div>

          <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <Reveal delay={700}>
              <Panel title="Traffic Sources" description="Where every lead came from (UTM source)">
                {isLoading ? (
                  <div className="h-50 w-full animate-pulse rounded-lg bg-muted/60" />
                ) : (
                  <BreakdownList items={metrics.trafficSources} total={metrics.totalLeads} />
                )}
              </Panel>
            </Reveal>

            <Reveal delay={800}>
              <Panel title="Top Ad Placements" description="Leads by UTM medium">
                {isLoading ? (
                  <div className="h-50 w-full animate-pulse rounded-lg bg-muted/60" />
                ) : (
                  <BreakdownList
                    items={metrics.placements}
                    emptyMessage="No placement data in the sheet."
                  />
                )}
              </Panel>
            </Reveal>

            <Reveal delay={900}>
              <Panel title="Pipeline Stages" description="Opportunity stages in Close CRM">
                {isLoading ? (
                  <div className="h-50 w-full animate-pulse rounded-lg bg-muted/60" />
                ) : (
                  <BreakdownList
                    items={metrics.pipelineStages}
                    emptyMessage="No opportunities in the CRM yet."
                  />
                )}
              </Panel>
            </Reveal>
          </div>

          <Reveal delay={1000} className="mt-6">
            <Panel
              title="Lead Grade Distribution"
              description={
                isLoading
                  ? "Loading lead scores…"
                  : metrics.avgLeadScore === null
                    ? "No scored leads in the sheet"
                    : `Average lead score ${metrics.avgLeadScore.toFixed(2)} across ${metrics.scoredLeads.toLocaleString()} scored leads`
              }
            >
              {isLoading ? (
                <div className="h-30 w-full animate-pulse rounded-lg bg-muted/60" />
              ) : metrics.gradeDistribution.length === 0 ? (
                <PanelEmpty message="No graded leads in the sheet." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {metrics.gradeDistribution.map((grade) => {
                    const share = totalGraded > 0 ? (grade.value / totalGraded) * 100 : 0;
                    return (
                      <div
                        key={grade.name}
                        className="rounded-lg border border-border bg-background/40 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Grade {grade.name}
                        </p>
                        <p className="mt-1 font-display text-2xl font-bold text-foreground">
                          {grade.value.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {share.toFixed(1)}% of graded leads
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>
          </Reveal>

          {/* Stretches to the bottom of the viewport so the page never ends short */}
          <Reveal delay={1100} className="mt-6 flex flex-1 flex-col">
            <Panel
              title="Channel Performance"
              description="Every acquisition channel from first touch to cash collected"
              className="flex-1"
            >
              {isLoading ? (
                <div className="h-50 w-full animate-pulse rounded-lg bg-muted/60" />
              ) : (
                <div className="space-y-8">
                  <PerformanceTable
                    rows={metrics.sourcePerformance}
                    label="Traffic source"
                    emptyMessage="No UTM sources in the sheet."
                  />
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Top campaigns by cash collected
                    </p>
                    <PerformanceTable
                      rows={metrics.campaignPerformance}
                      label="Campaign"
                      emptyMessage="No UTM campaigns in the sheet."
                    />
                  </div>
                </div>
              )}
            </Panel>
          </Reveal>
        </>
      )}
    </div>
  );
}
