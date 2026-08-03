import { Reveal } from "@/components/landing/Reveal";
import { Users, CreditCard, Activity, ArrowUpRight, PhoneCall, Star } from "lucide-react";
import { useSpreadsheetData } from "@/hooks/useSpreadsheetData";

export function OverviewCards() {
  const { data: spreadsheetData, isLoading, error } = useSpreadsheetData();

  let totalRevenue = 0;
  let activeStudents = 0;
  let bookedCalls = 0;
  let totalScore = 0;
  let validScores = 0;

  if (spreadsheetData) {
    activeStudents = spreadsheetData.length;
    
    spreadsheetData.forEach(row => {
      // Calculate Revenue
      const revenue = parseFloat(row["Cash_Collected_USD"] || "0");
      if (!isNaN(revenue)) {
        totalRevenue += revenue;
      }

      // Count Booked Calls
      if (row["Close_Booked_Call"] === "Yes") {
        bookedCalls++;
      }

      // Calculate Average Lead Score
      const score = parseFloat(row["Lead Score"]);
      if (!isNaN(score)) {
        totalScore += score;
        validScores++;
      }
    });
  }

  const avgLeadScore = validScores > 0 ? (totalScore / validScores).toFixed(1) : "0";

  const cards = [
    {
      title: "Total Revenue",
      value: isLoading ? "..." : `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "From all recorded leads",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      delay: 100,
    },
    {
      title: "Total Leads",
      value: isLoading ? "..." : activeStudents.toString(),
      change: "All captured leads",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      delay: 200,
    },
    {
      title: "Booked Calls",
      value: isLoading ? "..." : bookedCalls.toString(),
      change: "Total calls booked",
      icon: <PhoneCall className="h-4 w-4 text-muted-foreground" />,
      delay: 300,
    },
    {
      title: "Avg Lead Score",
      value: isLoading ? "..." : avgLeadScore,
      change: "Average across all leads",
      icon: <Star className="h-4 w-4 text-muted-foreground" />,
      delay: 400,
    },
  ];

  if (error) {
    return <div className="text-destructive p-4 border border-destructive/20 rounded-md">Error loading data: {(error as Error).message}</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Reveal key={i} delay={card.delay}>
          <div className="rounded-xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/20">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
                {card.title}
              </h3>
              {card.icon}
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
