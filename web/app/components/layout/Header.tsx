import { Link, NavLink, useLocation } from "react-router";
import { localePath, stripLocale, useLocale, type Locale } from "~/lib/i18n";
import { useT } from "~/lib/dictionary";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { key: "journal", path: "/journal" },
  { key: "explore", path: "/explore" },
  { key: "about", path: "/about" },
] as const;

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ja", label: "日本語" },
];

export default function Header() {
  const locale = useLocale();
  const t = useT();
  const { pathname, search } = useLocation();
  const basePath = stripLocale(pathname);

  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const focusInside = headerRef.current?.contains(document.activeElement);
      setHidden(y > 80 && y > last && !focusInside);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      data-hidden={hidden}
      className="header-styles"
    >
      <Link to={localePath("/", locale)} className="flex items-baseline gap-2">
        <h1 className="text-header font-extrabold">{t.header.title.main}</h1>
        <p className="text-ui text-muted-foreground hidden md:block">
          {t.header.title.secondary}
        </p>
      </Link>

      <nav className="gap-9 text-ui hidden md:flex">
        {NAV.map(({ key, path }) => (
          <NavLink
            key={key}
            to={localePath(path, locale)}
            className={({ isActive }) =>
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {t.header.nav[key]}
          </NavLink>
        ))}
      </nav>

      <div className="language-switch">
        {LANGUAGES.map(({ code, label }) => (
          <Link
            key={code}
            to={localePath(basePath, code) + search}
            lang={code}
            hrefLang={code}
            aria-current={code === locale ? "true" : undefined}
            preventScrollReset
          >
            {label}
          </Link>
        ))}
      </div>
    </header>
  );
}
