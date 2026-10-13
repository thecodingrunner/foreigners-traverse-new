import { useLayoutEffect, useState, type RefObject } from "react";

/** How many px of the scene each side's UI covers. */
export type Insets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const NONE: Insets = { top: 0, right: 0, bottom: 0, left: 0 };

/**
 * Measures how much of the scene is hidden behind UI marked with
 * `data-scene-cover` (the top bar, the panel, the timeline…), so the camera
 * can frame what's left. Each element is assigned to the edge it hugs:
 * wide elements cover the top or bottom, narrow ones the left or right.
 * That way the same attribute works when the panel becomes a bottom sheet.
 *
 * The values are also written to the container as CSS variables
 * (--scene-inset-top, …) so overlays like the orbit hint can avoid the UI too.
 */
export function useSceneInsets(container: RefObject<HTMLElement | null>) {
  const [insets, setInsets] = useState<Insets>(NONE);

  useLayoutEffect(() => {
    const scene = container.current;
    if (!scene) return;

    const measure = () => {
      const box = scene.getBoundingClientRect();
      const next = { ...NONE };

      for (const cover of document.querySelectorAll<HTMLElement>(
        "[data-scene-cover]",
      )) {
        const r = cover.getBoundingClientRect();
        const overlaps =
          r.right > box.left &&
          r.left < box.right &&
          r.bottom > box.top &&
          r.top < box.bottom;
        if (!overlaps) continue; // hidden, or outside the scene

        if (r.width > box.width * 0.6) {
          // Spans the scene: a bar along the top or the bottom
          if (r.top + r.height / 2 < box.top + box.height / 2)
            next.top = Math.max(next.top, r.bottom - box.top);
          else next.bottom = Math.max(next.bottom, box.bottom - r.top);
        } else if (r.left + r.width / 2 > box.left + box.width / 2) {
          next.right = Math.max(next.right, box.right - r.left);
        } else {
          next.left = Math.max(next.left, r.right - box.left);
        }
      }

      // Always leave some of the scene to look at (an open bottom sheet can
      // cover most of a phone screen, and the camera should frame what's left)
      const minWidth = Math.min(160, box.width * 0.25);
      const minHeight = Math.min(120, box.height * 0.2);
      next.right = Math.min(next.right, box.width - next.left - minWidth);
      next.bottom = Math.min(next.bottom, box.height - next.top - minHeight);

      for (const side of ["top", "right", "bottom", "left"] as const) {
        scene.style.setProperty(
          `--scene-inset-${side}`,
          `${Math.round(next[side])}px`,
        );
      }
      setInsets((prev) =>
        prev.top === next.top &&
        prev.right === next.right &&
        prev.bottom === next.bottom &&
        prev.left === next.left
          ? prev
          : next,
      );
    };

    measure();
    // Re-measure when the scene or any covering element changes size
    // (window resize, panel content changing, sheet expanding…)
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    document
      .querySelectorAll("[data-scene-cover]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [container]);

  return insets;
}
