import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  variant?: "up" | "stage";
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={cn(variant === "stage" ? "reveal-stage" : "reveal", className)}
    >
      {children}
    </Tag>
  );
}
