import { createFileRoute } from "@tanstack/react-router";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { BeforeAfterSlider } from "@/components/landing/BeforeAfterSlider";
import { CTASection } from "@/components/landing/CTASection";
import { Countdown } from "@/components/landing/Countdown";
import { HeroBadge } from "@/components/landing/HeroBadge";
import { HeroHeadline } from "@/components/landing/HeroHeadline";
import { Reveal } from "@/components/landing/Reveal";
import { SocialProof } from "@/components/landing/SocialProof";
import { content } from "@/lib/site-content";

const title = "Free Masterclass: Make Money Fast, 100% Halal";
const description =
  "Free 90-minute live training on the remote email skill that took me from €11/hour to $10K/month — no face, no audience, no products.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <AnnouncementBar />

      <section className="relative px-4 pt-14 pb-20 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px]"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 0%, oklch(0.78 0.12 40 / 0.10), transparent 70%)",
          }}
        />
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <Reveal>
            <HeroBadge />
          </Reveal>

          <div className="mt-8">
            <HeroHeadline />
          </div>

          <Reveal delay={320} className="mt-6 max-w-xl">
            <p className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {content.subLead}
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {content.subSupport}
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-16 sm:mt-20">
            <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {content.sliderTitle}
            </h2>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span className="drag-hint inline-block" aria-hidden="true">
                ↔
              </span>
              {content.sliderCaption}
            </p>
          </Reveal>

          <div className="mt-8 w-full">
            <BeforeAfterSlider />
          </div>

          <div className="mt-20 w-full sm:mt-24">
            <CTASection />
          </div>

          <div className="mt-20 w-full sm:mt-24">
            <Countdown />
          </div>

          <div className="mt-16 w-full sm:mt-20">
            <SocialProof />
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-10 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} · Free masterclass · Sunday August 9
        </p>
      </footer>
    </main>
  );
}
