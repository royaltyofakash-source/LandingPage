import { useEffect, useState } from "react";
import { EVENT_DATE_ISO, content } from "@/lib/site-content";
import { Reveal } from "./Reveal";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
] as const;

type Parts = Record<(typeof UNITS)[number]["key"], number>;

function getParts(): Parts {
  const diff = Math.max(0, new Date(EVENT_DATE_ISO).getTime() - Date.now());
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function Cell({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ink-foreground/12 bg-ink px-4 py-4 text-ink-foreground transition-transform duration-300 hover:-translate-y-1 sm:px-6 sm:py-5">
      <div className="relative h-[2.1rem] overflow-hidden sm:h-[2.6rem]">
        <span
          key={padded}
          className="flip-in block font-display text-[1.85rem] leading-[2.1rem] font-extrabold tracking-tight tabular-nums sm:text-[2.3rem] sm:leading-[2.6rem]"
        >
          {padded}
        </span>
      </div>
      <span className="mt-1 block text-[9px] font-bold tracking-[0.28em] text-ink-foreground/55 uppercase">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-coral/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );
}

export function Countdown() {
  const [parts, setParts] = useState<Parts>(() => getParts());

  useEffect(() => {
    const id = window.setInterval(() => setParts(getParts()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Reveal className="mx-auto w-full max-w-xl text-center">
      <p className="text-[10px] font-bold tracking-[0.32em] text-muted-foreground uppercase">
        {content.countdownTitle}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {UNITS.map((u) => (
          <Cell key={u.key} value={parts[u.key]} label={u.label} />
        ))}
      </div>
      <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-coral live-dot" aria-hidden="true" />
        <span>
          <strong className="font-bold text-foreground">1,847</strong>{" "}
          {content.registered.replace("1,847 ", "")}
        </span>
      </p>
    </Reveal>
  );
}
