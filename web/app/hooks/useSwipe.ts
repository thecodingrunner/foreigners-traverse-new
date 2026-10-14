import { useRef, type PointerEvent } from "react";

type Handlers = {
  onLeft?: () => void;
  onRight?: () => void;
  onDown?: () => void;
};

/** Horizontal swipes shorter than this (px) are ignored, so taps stay taps. */
const SWIPE_X = 40;
/** Downward swipes need to be deliberate: closing is the bigger action. */
const SWIPE_DOWN = 80;

/**
 * Touch / pen swipes as a prop getter: spread the result onto the element
 * that should listen. Mouse input is ignored, because mouse users have the
 * arrow buttons and dragging would get in the way of selecting text.
 *
 * The element needs `touch-action: none`, otherwise the browser claims the
 * gesture for scrolling and sends pointercancel instead of pointerup.
 */
export function useSwipe({ onLeft, onRight, onDown }: Handlers) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onPointerDown: (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      start.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: PointerEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      // Whichever direction moved further decides what the gesture meant
      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy > SWIPE_DOWN) onDown?.();
      } else if (dx < -SWIPE_X) onLeft?.();
      else if (dx > SWIPE_X) onRight?.();
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
}
