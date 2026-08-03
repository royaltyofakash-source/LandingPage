import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Activity,
  BarChart3,
  Table2,
} from "lucide-react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card/50 backdrop-blur-xl">
        <div className="flex h-16 items-center px-6 border-b border-border">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground"
          >
            <span className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="h-5 w-5" />
            </span>
            TransforHub
          </Link>
        </div>

        <div className="px-4 py-6 space-y-1">
          <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Main Menu
          </h4>
          <Link
            to="/dashboard"
            activeProps={{ className: "bg-primary/10 text-primary" }}
            inactiveProps={{
              className: "text-muted-foreground hover:bg-accent hover:text-foreground",
            }}
            activeOptions={{ exact: true }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link
            to="/dashboard/analytics"
            activeProps={{ className: "bg-primary/10 text-primary" }}
            inactiveProps={{
              className: "text-muted-foreground hover:bg-accent hover:text-foreground",
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            to="/dashboard/students"
            activeProps={{ className: "bg-primary/10 text-primary" }}
            inactiveProps={{
              className: "text-muted-foreground hover:bg-accent hover:text-foreground",
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <Users className="h-4 w-4" />
            Students
          </Link>
          <Link
            to="/dashboard/sheet"
            activeProps={{ className: "bg-primary/10 text-primary" }}
            inactiveProps={{
              className: "text-muted-foreground hover:bg-accent hover:text-foreground",
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <Table2 className="h-4 w-4" />
            Sheet
          </Link>

          <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-8 mb-4">
            System
          </h4>
          <Link
            to="/dashboard/settings"
            activeProps={{ className: "bg-primary/10 text-primary" }}
            inactiveProps={{
              className: "text-muted-foreground hover:bg-accent hover:text-foreground",
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex h-screen flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-md">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Dashboard Overview
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary-foreground shadow-inner flex items-center justify-center text-white text-xs font-bold">
              TH
            </div>
          </div>
        </header>

        {/* Page Content — owns the vertical scroll so the sidebar/header stay put */}
        <div className="flex w-full min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
