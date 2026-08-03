import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/landing/Reveal";
import { BarChart3, TrendingUp, DollarSign, Activity } from "lucide-react";

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [{ title: "Analytics - Transformation Hub" }],
  }),
});

function AnalyticsPage() {
  return (
    <>
      <div className="space-y-2 mb-8">
        <Reveal delay={0}>
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-muted-foreground">
            Detailed breakdown of your revenue and student engagement.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {[
          { title: "Monthly Recurring Revenue", value: "$45,231.89", icon: <DollarSign className="h-5 w-5" /> },
          { title: "Growth Rate", value: "+24.5%", icon: <TrendingUp className="h-5 w-5" /> },
          { title: "Active Engagement", value: "87.3%", icon: <Activity className="h-5 w-5" /> },
        ].map((stat, i) => (
          <Reveal key={i} delay={150 + i * 50}>
            <div className="rounded-xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4 text-muted-foreground">
                <span className="text-sm font-medium">{stat.title}</span>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold font-display text-foreground">{stat.value}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal delay={300}>
          <div className="rounded-xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-medium text-foreground tracking-tight mb-6">Revenue Over Time</h3>
            <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4">
              {[40, 60, 45, 80, 55, 90, 75].map((height, i) => (
                <div key={i} className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors relative group" style={{ height: `${height}%` }}>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded transition-opacity shadow-md">
                    ${(height * 450).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-4">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={400}>
          <div className="rounded-xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-medium text-foreground tracking-tight mb-6">Traffic Sources</h3>
            <div className="space-y-6">
              {[
                { source: "Direct Traffic", value: "45%", color: "bg-primary" },
                { source: "Social Media (Instagram)", value: "30%", color: "bg-coral" },
                { source: "Organic Search", value: "15%", color: "bg-primary/50" },
                { source: "Referrals", value: "10%", color: "bg-border" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{item.source}</span>
                    <span className="text-muted-foreground">{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
