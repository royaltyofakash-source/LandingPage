import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Activity,
  BarChart3,
  Table2,
  Menu,
  X,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    heading: "Main Menu",
    links: [
      { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
      { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/dashboard/students", label: "Students", icon: Users },
      { to: "/dashboard/sheet", label: "Sheet", icon: Table2 },
    ],
  },
  {
    heading: "System",
    links: [{ to: "/dashboard/settings", label: "Settings", icon: Settings }],
  },
] as const;

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/analytics": "Analytics",
  "/dashboard/students": "Students",
  "/dashboard/sheet": "Spreadsheet Data",
  "/dashboard/settings": "Settings",
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [navOpen, setNavOpen] = useState(false);

  // The drawer is only a mobile concern — close it whenever the route changes.
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // Prevent the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    if (!navOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [navOpen]);

  useEffect(() => {
    if (!navOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Backdrop — mobile only, sits under the drawer */}
      <div
        onClick={() => setNavOpen(false)}
        aria-hidden={!navOpen}
        className={`fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          navOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar — off-canvas below lg, always visible from lg up */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col border-r border-border bg-card backdrop-blur-xl transition-transform duration-300 ease-out lg:translate-x-0 lg:bg-card/50 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground sm:text-xl"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </span>
            TransforHub
          </Link>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            aria-label="Close navigation"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {NAV_SECTIONS.map((section, sectionIndex) => (
            <div key={section.heading} className={sectionIndex > 0 ? "pt-8" : undefined}>
              <h4 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.heading}
              </h4>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    activeProps={{ className: "bg-primary/10 text-primary" }}
                    inactiveProps={{
                      className: "text-muted-foreground hover:bg-accent hover:text-foreground",
                    }}
                    {...("exact" in link ? { activeOptions: { exact: link.exact } } : {})}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-border p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
              className="-ml-2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg lg:text-xl">
              {title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary-foreground text-xs font-bold text-white shadow-inner">
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
