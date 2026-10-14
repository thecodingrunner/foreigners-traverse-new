import { useId, useRef, useState } from "react";
import type { StageDetail } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import Lightbox from "./Lightbox";

/** Three columns from 1024px up, two below. */
const THUMB_SIZES = "(min-width: 1024px) 33vw, 50vw";

export default function StageGallery({ stage }: { stage: StageDetail }) {
    const t = useT();
    const photos = stage.gallery;
    const headingId = useId();
    const [index, setIndex] = useState<number | null>(null);
    const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
    const lastIndex = useRef(0);

    if (photos.length === 0) return null;
    const dayLabel = stage.stageNumber != null ? t.stage.day(stage.stageNumber) : "";

    const show = (i: number) => {
        lastIndex.current = i;
        setIndex(i);
    };

    const close = () => {
        setIndex(null);
        thumbs.current[lastIndex.current]?.focus();
    };

    return (
        <section className="stage-gallery" aria-labelledby={headingId}>
            <header className="stage-gallery-head">
                <div>
                    <h2 id={headingId} className="text-h3">{t.stage.gallery.title}</h2>
                    <p className="stage-gallery-alt">{t.stage.gallery.titleAlt}</p>
                </div>
                <p className="stage-gallery-count">{t.stage.gallery.count(photos.length)}</p>
            </header>

            <ul className="stage-gallery-grid">
                {photos.map((photo, i) => (
                    <li key={photo.key}>
                        <figure>
                            <button
                                ref={(el) => {
                                    thumbs.current[i] = el;
                                }}
                                type="button"
                                className="stage-gallery-thumb"
                                aria-label={t.stage.gallery.open(photo.caption || photo.alt)}
                                onClick={() => show(i)}
                            >
                                <img
                                    src={photo.src}
                                    srcSet={photo.srcSet}
                                    sizes={THUMB_SIZES}
                                    width={photo.width}
                                    height={photo.height}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                />
                            </button>
                            {(photo.place || photo.placeAlt) && (
                                <figcaption>
                                    <span>{photo.place}</span>
                                    {photo.placeAlt && <span>{photo.placeAlt}</span>}
                                </figcaption>
                            )}
                        </figure>
                    </li>
                ))}
            </ul>

            <Lightbox photos={photos} index={index} onIndexChange={show} onClose={close} dayLabel={dayLabel} />
        </section>
    )
}