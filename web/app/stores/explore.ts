import { createStore } from "zustand/vanilla";
import { indexAt } from "~/lib/explore";

export type CameraMode = "overview" | "follow" | "orbit";
export const SPEEDS = [1, 2, 4] as const;
export type Speed = (typeof SPEEDS)[number];

const KM_PER_SECOND = 25;

export type ExploreState = {
  count: number;
  position: number;
  playing: boolean;
  speed: Speed;
  mode: CameraMode;
  setPosition: (position: number) => void;
  selectIndex: (index: number) => void;
  step: (delta: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setSpeed: (speed: Speed) => void;
  setMode: (mode: CameraMode) => void;
  advance: (seconds: number) => void;
  advanceSlide: () => void;
};

export function createExploreStore(kms: number[], initialPosition: number) {
  const count = kms.length;
  const clamp = (p: number) => Math.min(count, Math.max(0, p));

  return createStore<ExploreState>()((set, get) => ({
    count,
    position: clamp(initialPosition),
    playing: false,
    speed: 1,
    mode: "overview",

    setPosition: (position) => set({ position: clamp(position) }),
    selectIndex: (index) => set({ position: clamp(index + 1), playing: false }),

    // Next: the end of the current or next day. Previous: back to the last day's end.
    step: (delta) => {
      const p = get().position;
      set({
        position: clamp(
          delta > 0 ? Math.floor(p) + delta : Math.ceil(p) + delta,
        ),
      });
    },

    play: () =>
      set((s) => ({
        playing: true,
        position: s.position >= count ? 0 : s.position,
      })),
    pause: () => set({ playing: false }),
    toggle: () => (get().playing ? get().pause() : get().play()),
    setSpeed: (speed) => set({ speed }),
    setMode: (mode) => set({ mode }),

    // Normal playback: move a distance along the road, crossing stage ends as needed.
    advance: (seconds) =>
      set((s) => {
        let p = s.position;
        let km = KM_PER_SECOND * s.speed * seconds;
        while (km > 0 && p < count) {
          const i = Math.min(Math.floor(p), count - 1);
          const left = (i + 1 - p) * kms[i];
          if (km < left) {
            p += km / kms[i];
            km = 0;
          } else {
            p = i + 1;
            km -= left;
          }
        }
        return p >= count
          ? { position: count, playing: false }
          : { position: p };
      }),

    // Reduced motion: jump to the end of the next day.
    advanceSlide: () =>
      set((s) => {
        const next = Math.floor(s.position) + 1;
        return next >= count
          ? { position: count, playing: false }
          : { position: next };
      }),
  }));
}
