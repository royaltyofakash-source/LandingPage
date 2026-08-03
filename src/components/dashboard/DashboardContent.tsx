import { Reveal } from "@/components/landing/Reveal";
import { useSpreadsheetData } from "@/hooks/useSpreadsheetData";

export function DashboardContent() {
  const { data, isLoading } = useSpreadsheetData();
  
  // Get latest 5 leads assuming they are at the end of the sheet, or just take first 5
  // Depending on how sheet is sorted, taking the last 5 makes sense for "recent" if appended at the bottom
  const recentLeads = data ? [...data].reverse().slice(0, 5) : [];

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <Reveal delay={500} className="col-span-4 lg:col-span-4">
        <div className="rounded-xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm h-full min-h-[350px] flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground tracking-tight">Revenue Overview</h3>
            <p className="text-sm text-muted-foreground">Monthly performance metrics</p>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg bg-accent/20">
            <p className="text-sm text-muted-foreground">Chart Area (Integration pending)</p>
          </div>
        </div>
      </Reveal>
      
      <Reveal delay={600} className="col-span-4 lg:col-span-3">
        <div className="rounded-xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm h-full min-h-[350px]">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground tracking-tight">Recent Signups</h3>
            <p className="text-sm text-muted-foreground">Latest leads from your CRM</p>
          </div>
          <div className="space-y-6 mt-6">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading recent leads...</p>
            ) : recentLeads.length > 0 ? (
              recentLeads.map((lead, i) => {
                const cash = parseFloat(lead["Cash_Collected_USD"]);
                const hasCash = !isNaN(cash) && cash > 0;
                
                return (
                  <div key={i} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xs shrink-0">
                      {lead["Lead Name"] ? lead["Lead Name"].charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="ml-4 space-y-1 overflow-hidden">
                      <p className="text-sm font-medium leading-none text-foreground truncate">
                        {lead["Lead Name"] || "Unknown User"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {lead["Email"] || "No email"}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-sm whitespace-nowrap pl-2 flex flex-col items-end">
                      {hasCash ? (
                        <span className="text-emerald-500">
                          +${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-normal text-xs">
                          {lead["Date Captured"] ? new Date(lead["Date Captured"]).toLocaleDateString() : "No Date"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No recent leads found.</p>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
