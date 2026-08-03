import { useEffect, useState } from "react";
import { content } from "@/lib/site-content";
import { useReveal } from "@/hooks/use-reveal";

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);

  return value;
}

function StatCard({ stat, run }: { stat: (typeof content.stats)[number]; run: boolean }) {
  const value = useCountUp(stat.value, run);
  return (
    <div className="flex-1 px-6 py-7 text-center">
      <p className="font-display text-3xl font-extrabold tracking-tight tabular-nums text-foreground sm:text-4xl">
        {"prefix" in stat ? stat.prefix : ""}
        {value.toLocaleString("en-US")}
        {stat.suffix}
      </p>
      <p className="mt-2 text-[10px] font-bold tracking-[0.24em] text-muted-foreground uppercase">
        {stat.label}
      </p>
    </div>
  );
}

export function SocialProof() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.35);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className="reveal mx-auto w-full max-w-3xl divide-y divide-border rounded-3xl border border-border bg-secondary/50 backdrop-blur-sm sm:flex sm:divide-x sm:divide-y-0"
    >
      {content.stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} run={visible} />
      ))}
    </div>
  );
}
