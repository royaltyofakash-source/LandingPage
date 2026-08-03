import { content } from "@/lib/site-content";
import { Reveal } from "./Reveal";

export function HeroHeadline() {
  return (
    <h1 className="mx-auto max-w-[820px] font-display text-[2.6rem] leading-[0.98] font-extrabold tracking-[-0.035em] text-balance text-foreground sm:text-6xl lg:text-[4.6rem]">
      <Reveal as="span" delay={80} className="block">
        {content.headline[0]}
      </Reveal>
      <Reveal as="span" delay={200} className="block">
        {content.headline[1]}{" "}
        <span className="coral-shimmer">{content.headlineAccent}</span>
      </Reveal>
    </h1>
  );
}
