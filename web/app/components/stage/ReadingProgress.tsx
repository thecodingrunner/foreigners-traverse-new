import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

export const PROGRESS_SLOT_ID = "reading-progress-slot";

type Props = {
  target?: RefObject<HTMLElement | null>;
};

export default function ReadingProgress({ target }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSlot(document.getElementById(PROGRESS_SLOT_ID));
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    if (!slot || !bar) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const el = target?.current ?? document.documentElement;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;

      const progress =
        scrollable > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollable))
          : rect.bottom <= window.innerHeight
            ? 1
            : 0;

      bar.style.transform = `scaleX(${progress})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const observer = new ResizeObserver(schedule);
    observer.observe(target?.current ?? document.documentElement);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [slot, target]);

  if (!slot) return null;

  return createPortal(
    <div
      ref={barRef}
      className="h-full origin-left bg-accent will-change-transform"
      style={{ transform: "scaleX(0)" }}
    />,
    slot,
  );
}
