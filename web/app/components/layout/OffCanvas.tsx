import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router";
import type { RideTotals } from "~/data/stages.server";
import { useIsNavActive, useLanguageHref } from "~/hooks/navigation";
import { getDictionary, useT } from "~/lib/dictionary";
import { formatNumber } from "~/lib/format";
import { localePath, stripLocale, useLocale, type Locale } from "~/lib/i18n";
import { LANGUAGES, NAV } from "~/lib/navigation";

type OffCanvasProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  totals: RideTotals | null;
};

export default function OffCanvas({
  id,
  open,
  onClose,
  totals,
}: OffCanvasProps) {
  const locale = useLocale();
  const t = useT();
  const otherLocale: Locale = locale === "en" ? "ja" : "en";
  const tOther = getDictionary(otherLocale);
  const isActive = useIsNavActive();
  const languageHref = useLanguageHref();

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = "unset";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      id={id}
      className={`off-canvas md:hidden`}
      data-open={open}
      inert={!open}
    >
        
      <div className="nav-menu">
        {NAV.map(({ key, path }, index) => (
          <NavLink
            key={key}
            to={localePath(path, locale)}
            aria-current={isActive(path) ? "page" : undefined}
            className={`link-item group`}
          >
            <span className="text-label">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-h2 transition-colors duration-300 group-hover:text-accent">
                {t.header.nav[key]}
              </span>
              <span lang={otherLocale} className="text-ui text-ink-3">
                {tOther.header.nav[key]}
              </span>
            </span>
            <span className="text-ink-3 text-prose">→</span>
          </NavLink>
        ))}
      </div>

      <div className="pt-8 flex flex-col gap-2.5">
        <p className="text-label">{t.header.offCanvas.language}</p>
        <div className="language-toggle w-full">
          {LANGUAGES.map(({ code, long }) => (
            <Link
              key={code}
              to={languageHref(code)}
              lang={code}
              hrefLang={code}
              aria-current={code === locale ? "true" : undefined}
              preventScrollReset
              className="language-toggle-link text-ui"
            >
              {long}
            </Link>
          ))}
        </div>
        <p className="text-ui">{t.header.offCanvas.languageSubtitle}</p>
      </div>

      <div className="off-canvas-footer">
        {totals && (
          <p className="text-label-sm">
            {formatNumber(Math.round(totals.distanceKm), locale)} km ·{" "}
            {totals.days} days · {totals.prefectures} prefectures
          </p>
        )}

        <div className="text-ui flex gap-6">
          <a
            href="https://github.com/thecodingrunner/foreigners-traverse"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
}
