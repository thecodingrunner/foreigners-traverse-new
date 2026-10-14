// app/components/stage/Lightbox.tsx
//
// Full-screen photo viewer on the native <dialog> element. showModal() gives
// us, for free: a focus trap, Esc to close, everything behind it made inert,
// and rendering in the top layer (above any z-index).
import { useEffect, useRef, type KeyboardEvent } from "react";
import { useSwipe } from "~/hooks/useSwipe";
import { useT } from "~/lib/dictionary";
import type { GalleryPhoto } from "~/lib/gallery";

type Props = {
  photos: GalleryPhoto[];
  /** The photo on show, or null when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** "Day 9", shown next to the gallery title. */
  dayLabel: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Most of the screen on desktop (minus the arrow columns), all of it on phones. */
const SIZES = "(min-width: 1024px) calc(100vw - 208px), 100vw";

export default function Lightbox({ photos, index, onIndexChange, onClose, dayLabel }: Props) {
  const t = useT().stage.gallery;
  const dialog = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const photo = open ? photos[index] : null;

  // Wrap around at both ends: after the last photo comes the first
  const go = (step: number) => {
    if (index === null) return;
    onIndexChange((index + step + photos.length) % photos.length);
  };
  const swipe = useSwipe({ onLeft: () => go(1), onRight: () => go(-1), onDown: () => dialog.current?.close() });

  // ---- Keep the <dialog> in step with React state
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  // ---- Preload the neighbours, so stepping through feels instant
  useEffect(() => {
    if (index === null || photos.length < 2) return;
    for (const step of [1, -1]) {
      const p = photos[(index + step + photos.length) % photos.length];
      const img = new Image();
      img.sizes = SIZES; // set before srcset, so the browser picks the same file the <img> will
      if (p.srcSet) img.srcset = p.srcSet;
      img.src = p.src;
    }
  }, [index, photos]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
    // Esc is handled by <dialog> itself: it fires "close", which calls onClose
  };

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label={t.title}
      onClose={onClose} // every way of closing (Esc, ×, swipe) ends up here
      onKeyDown={onKeyDown}
    >
      {photo && index !== null && (
        <>
          <div className="lightbox-bar">
            {/* Visually "03 / 12"; read out as "Photo 3 of 12" */}
            <p className="lightbox-count" aria-live="polite" aria-atomic="true">
              <span aria-hidden="true">
                {pad(index + 1)} / {pad(photos.length)}
              </span>
              <span className="sr-only">{t.photoOf(index + 1, photos.length)}</span>
            </p>
            <p className="lightbox-title" aria-hidden="true">
              {t.title} · {dayLabel}
            </p>
            <button type="button" className="lightbox-close" aria-label={t.close} autoFocus onClick={() => dialog.current?.close()}>
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <button type="button" className="lightbox-arrow is-prev" aria-label={t.previous} onClick={() => go(-1)}>
            <span aria-hidden="true">←</span>
          </button>

          <div className="lightbox-photo" {...swipe}>
            {/* key: a fresh <img> per photo, so the old picture never sits under the new caption */}
            <img
              key={photo.key}
              src={photo.src}
              srcSet={photo.srcSet}
              sizes={SIZES}
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              decoding="async"
              draggable={false}
            />
          </div>

          <button type="button" className="lightbox-arrow is-next" aria-label={t.next} onClick={() => go(1)}>
            <span aria-hidden="true">→</span>
          </button>

          <div className="lightbox-info">
            {photo.caption && <p className="lightbox-caption">{photo.caption}</p>}
            {(photo.place || photo.placeAlt) && (
              <p className="lightbox-places">
                {photo.place && <span className="lightbox-place">{photo.place}</span>}
                {photo.placeAlt && <span className="lightbox-place-alt">{photo.placeAlt}</span>}
              </p>
            )}
            {/* CSS shows the one that matches the reader's input: keys or touch */}
            <p className="lightbox-hint is-keys" aria-hidden="true">
              ← → · Esc
            </p>
            <p className="lightbox-hint is-touch" aria-hidden="true">
              {t.swipeHint}
            </p>
          </div>
        </>
      )}
    </dialog>
  );
}