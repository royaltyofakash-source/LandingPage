import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { Reveal } from "@/components/landing/Reveal";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: "Overview - Transformation Hub" }],
  }),
});

function DashboardPage() {
  return (
    <div className="flex w-full flex-1 flex-col p-6 sm:p-8">
      <div className="space-y-2 mb-8">
        <Reveal delay={0}>
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
            Welcome back, Maria Toscano
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-muted-foreground">
            Here's what's happening with your masterclass today.
          </p>
        </Reveal>
      </div>

      <OverviewCards />
      <DashboardContent />

      {/* Background radial gradient to maintain theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
        style={{
          background:
            "radial-gradient(100% 100% at 50% 0%, oklch(0.78 0.12 40 / 0.05), transparent 80%)",
        }}
      />
    </div>
  );
}
