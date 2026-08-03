import { content } from "@/lib/site-content";

export function HeroBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-4 py-1.5 shadow-[0_6px_20px_-12px_oklch(0.22_0.035_264/0.6)] backdrop-blur-md">
      <span className="h-1.5 w-1.5 rounded-full bg-coral live-dot" aria-hidden="true" />
      <span className="text-[10px] font-bold tracking-[0.24em] text-muted-foreground uppercase">
        {content.eyebrow}
      </span>
    </span>
  );
}
