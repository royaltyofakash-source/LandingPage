import { content } from "@/lib/site-content";
import { Reveal } from "./Reveal";

export function CTASection() {
  return (
    <Reveal className="relative mx-auto w-full max-w-3xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 50%, oklch(0.78 0.12 40 / 0.22), transparent 70%)",
        }}
      />
      <a
        href="#register"
        className="cta-surface group relative flex w-full flex-col items-center gap-4 overflow-hidden rounded-3xl px-6 py-7 text-coral-foreground transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] sm:flex-row sm:justify-between sm:px-10 sm:py-8"
      >
        <span
          aria-hidden="true"
          className="cta-sheen pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
        <span className="relative font-display text-xl leading-tight font-extrabold tracking-tight uppercase sm:text-2xl">
          {content.ctaLabel}{" "}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
        <span className="relative text-center text-xs leading-relaxed text-coral-foreground/85 sm:border-l sm:border-coral-foreground/25 sm:pl-8 sm:text-left">
          {content.ctaMetaTop}
          <br />
          {content.ctaMetaBottom}
        </span>
      </a>
    </Reveal>
  );
}
