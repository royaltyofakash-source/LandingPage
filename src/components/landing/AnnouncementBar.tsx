import { content } from "@/lib/site-content";

export function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden border-b border-ink-foreground/10 bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-coral live-dot" aria-hidden="true" />
        <p className="truncate text-[9px] font-semibold tracking-[0.14em] uppercase sm:text-[11px] sm:tracking-[0.3em]">
          {content.ticker}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-ink-foreground/10 to-transparent ticker-shimmer"
      />
    </div>
  );
}
