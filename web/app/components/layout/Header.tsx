import { Link, NavLink, useLocation } from "react-router";
import { localePath, stripLocale, useLocale, type Locale } from "~/lib/i18n";
import { getDictionary, useT } from "~/lib/dictionary";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RideTotals } from "~/data/stages.server";
import { formatNumber } from "~/lib/format";
import OffCanvas from "./OffCanvas";
import {
  useHideOnScroll,
  useIsNavActive,
  useLanguageHref,
} from "~/hooks/navigation";
import { LANGUAGES, NAV } from "~/lib/navigation";

type HeaderProps = {
  totals: RideTotals | null;
};

export default function Header({ totals }: HeaderProps) {
  const locale = useLocale();
  const t = useT();
  const isActive = useIsNavActive();
  const languageHref = useLanguageHref();
  const { pathname, search } = useLocation();

  const headerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => setMenuOpen(false), [pathname, search]);

  const hidden = useHideOnScroll(headerRef) && !menuOpen;

  return (
    <>
      <header ref={headerRef} data-hidden={hidden} className="header-styles">
        <Link
          to={localePath("/", locale)}
          className="flex items-baseline gap-2"
        >
          <h1 className="text-header font-extrabold">{t.header.title.main}</h1>
          <p className="text-ui text-muted-foreground hidden md:block">
            {t.header.title.secondary}
          </p>
        </Link>

        <nav className="gap-9 text-ui hidden md:flex">
          {NAV.map(({ key, path }) => (
            <Link
              key={key}
              to={localePath(path, locale)}
              className="nav-link"
              aria-current={isActive(path) ? "page" : undefined}
            >
              {t.header.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="language-switch hidden md:flex">
          {LANGUAGES.map(({ code, short }) => (
            <Link
              key={code}
              to={languageHref(code)}
              lang={code}
              hrefLang={code}
              aria-current={code === locale ? "true" : undefined}
              preventScrollReset
            >
              {short}
            </Link>
          ))}
        </div>

        <div className="flex items-center md:hidden">
          <div className="text-label-sm">
            {locale === "en" ? <p>EN</p> : <p>日本語</p>}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-1 md:hidden"
            aria-label={t.header.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div
              className={`h-[1.5px] w-5.5 bg-secondary transition-all duration-300 ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`}
            ></div>
            <div
              className={`h-[1.5px] w-5.5 bg-secondary transition-all duration-300 ${menuOpen ? "-translate-y-[3px] -rotate-[45deg]" : ""}`}
            ></div>
          </button>
        </div>
      </header>

      <OffCanvas
        id="mobile-menu"
        open={menuOpen}
        onClose={closeMenu}
        totals={totals}
      />
    </>
  );
}
