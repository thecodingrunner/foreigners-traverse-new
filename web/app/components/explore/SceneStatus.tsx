import { Link } from "react-router";
import { useT } from "~/lib/dictionary";
import { localePath, useLocale } from "~/lib/i18n";
import type { LoadProgress } from "./scene/assets";

const toMb = (bytes: number) => (bytes / 1_000_000).toFixed(1);

export function SceneLoading({ progress }: { progress: LoadProgress | null }) {
  const t = useT();
  const fraction = progress?.total
    ? Math.min(1, progress.loaded / progress.total)
    : null;

  return (
    <div className="scene-status" role="status" aria-live="polite">
      <p className="text-label">{t.explore.loadingTitle}</p>
      <p className="scene-status-percent">
        {fraction !== null ? `${Math.round(fraction * 100)}%` : "..."}
      </p>
      <div className="scene-status-bar" aria-hidden="true">
        <span style={{ width: `${(fraction ?? 0) * 100}%` }} />
      </div>
      {progress && progress.loaded > 0 && (
        <p className="text-label-sm normal-case">
          {t.explore.loadingDetail(
            toMb(progress.loaded),
            progress.total ? toMb(progress.total) : null,
          )}
        </p>
      )}
    </div>
  );
}

export function NoWebGLCard() {
  const t = useT();
  const locale = useLocale();

  return (
    <div className="scene-card" role="alert">
      <p className="text-label text-accent-light">{t.explore.noglTag}</p>
      <h2 className="text-h3">{t.explore.noglTitle}</h2>
      <p className="text-body">{t.explore.noglBody}</p>
      <Link
        to={localePath("/journal?view=map", locale)}
        className="btn-primary"
      >
        {t.explore.noglCta} →
      </Link>
    </div>
  );
}

export function SceneError({ onRetry }: { onRetry: () => void }) {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="scene-card" role="alert">
      <h2 className="text-h3">{t.explore.errorTitle}</h2>
      <p className="text-body">{t.explore.errorBody}</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={onRetry}>{t.explore.retry}</button>
        <Link to={localePath("/journal?view=map", locale)} className="btn-dark">
          {t.explore.noglCta} →
        </Link>
      </div>
    </div>
  );
}