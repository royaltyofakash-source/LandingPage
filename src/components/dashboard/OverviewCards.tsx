import { Reveal } from "@/components/landing/Reveal";
import { Users, CreditCard, PhoneCall, Trophy } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { DataError, StatCard } from "@/components/dashboard/Panel";
import { formatCurrency, formatPercent } from "@/lib/dashboard-metrics";

export function OverviewCards() {
  const { metrics, isLoading, error } = useDashboardMetrics();

  if (error) return <DataError message={(error as Error).message} />;

  const cards = [
    {
      title: "Cash Collected",
      value: formatCurrency(metrics.totalRevenue, 2),
      hint: `${metrics.payingCustomers.toLocaleString()} paying customers`,
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      delay: 100,
    },
    {
      title: "Total Leads",
      value: metrics.totalLeads.toLocaleString(),
      hint: `${metrics.leadsInCrm.toLocaleString()} pushed into Close CRM`,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      delay: 200,
    },
    {
      title: "Booked Calls",
      value: metrics.bookedCalls.toLocaleString(),
      hint: `${formatPercent(metrics.bookingRate)} of all leads booked`,
      icon: <PhoneCall className="h-4 w-4 text-muted-foreground" />,
      delay: 300,
    },
    {
      title: "Deals Closed",
      value: metrics.closedDeals.toLocaleString(),
      hint: `${formatPercent(metrics.closeRate)} close rate on booked calls`,
      icon: <Trophy className="h-4 w-4 text-muted-foreground" />,
      delay: 400,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
      {cards.map((card) => (
        <Reveal key={card.title} delay={card.delay}>
          <StatCard
            title={card.title}
            value={card.value}
            hint={card.hint}
            icon={card.icon}
            isLoading={isLoading}
          />
        </Reveal>
      ))}
    </div>
  );
}
