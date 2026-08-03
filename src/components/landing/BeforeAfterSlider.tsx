import { useCallback, useEffect, useRef, useState } from "react";
import afterImg from "@/assets/after-elevator.jpg";
import beforeImg from "@/assets/before-waiter.jpg";
import { content } from "@/lib/site-content";
import { useReveal } from "@/hooks/use-reveal";

export function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { ref: revealRef, visible } = useReveal<HTMLDivElement>(0.15);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => updateFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, updateFromClientX]);

  const onPointerMoveStage = (e: React.PointerEvent) => {
    const el = stageRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const rx = (e.clientY - rect.top) / rect.height - 0.5;
    const ry = (e.clientX - rect.left) / rect.width - 0.5;
    el.style.setProperty("--tilt-x", `${(-rx * 3).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(ry * 3).toFixed(2)}deg`);
  };

  const resetTilt = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div ref={revealRef} className="relative mx-auto w-full max-w-[540px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-16 -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(50% 45% at 50% 55%, oklch(0.78 0.12 40 / 0.28), transparent 70%)",
        }}
      />
      <div
        ref={stageRef}
        data-visible={visible}
        onPointerMove={onPointerMoveStage}
        onPointerLeave={resetTilt}
        style={{ perspective: "1200px" }}
        className="reveal-stage group rounded-[2rem] border border-border/70 bg-card/60 p-2 backdrop-blur-sm stage-shadow transition-[box-shadow,transform] duration-500 hover:stage-shadow-hover"
      >
        <div
          ref={frameRef}
          onPointerDown={(e) => {
            setDragging(true);
            updateFromClientX(e.clientX);
          }}
          className="relative aspect-[3/4] w-full touch-none overflow-hidden rounded-[1.6rem] bg-ink select-none transition-transform duration-500 ease-out group-hover:scale-[1.008]"
          style={{
            transform:
              "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
          }}
        >
          <img
            src={afterImg}
            alt="The new way: earning $10K per month remotely"
            width={912}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <img
              src={beforeImg}
              alt="The old way: working long restaurant shifts for €11 an hour"
              width={912}
              height={1200}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/85 to-transparent" />
          <div className="pointer-events-none absolute bottom-5 left-5 text-ink-foreground">
            <p className="font-display text-xl font-extrabold tracking-tight">
              {content.beforeLabel.split(" · ")[0]}
            </p>
            <p className="text-xs text-ink-foreground/70">
              {content.beforeLabel.split(" · ")[1]}
            </p>
          </div>
          <div className="pointer-events-none absolute right-5 bottom-5 text-right text-ink-foreground">
            <p className="font-display text-xl font-extrabold tracking-tight">
              {content.afterLabel.split(" · ")[0]}
            </p>
            <p className="text-xs text-ink-foreground/70">
              {content.afterLabel.split(" · ")[1]}
            </p>
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-coral"
            style={{ left: `${position}%` }}
          />
          <button
            type="button"
            role="slider"
            aria-label="Comparison slider: drag to compare the old way and the new way"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={(e) => {
              e.stopPropagation();
              setDragging(true);
            }}
            className="absolute top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-border bg-card shadow-lg transition-transform duration-200 hover:scale-110"
            style={{ left: `${position}%` }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-coral"
              aria-hidden="true"
            >
              <path d="m9 6-5 6 5 6" />
              <path d="m15 6 5 6-5 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
