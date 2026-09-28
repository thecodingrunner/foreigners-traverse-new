import { Link, NavLink, useLocation } from "react-router";
import { useT } from "~/lib/dictionary";
import { localePath, stripLocale, useLocale, type Locale } from "~/lib/i18n";

const NAV = [
  { key: "journal", path: "/journal" },
  { key: "explore", path: "/explore" },
  {
    key: "github",
    path: "https://github.com/thecodingrunner/foreigners-traverse-new",
  },
] as const;

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ja", label: "日本語" },
];

export default function Footer() {
  const locale = useLocale();
  const t = useT();
  const { pathname, search } = useLocation();
  const basePath = stripLocale(pathname);

  return (
    <footer className="py-5 md:py-10 padding-x flex justify-between items-end border-t border-border">
      <div className="">
        <p className="text-label-sm md:text-body font-extrabold">
          {t.footer.title}
        </p>

        <p className="text-body text-muted-foreground hidden md:block">
          {t.footer.subtitle}
        </p>
      </div>

      <nav className="gap-8 text-ui hidden md:flex">
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
            {t.footer.nav[key]}
          </NavLink>
        ))}
      </nav>

      <div className="block md:hidden text-label-sm">
        {LANGUAGES.map(({ code, label }, index) => (
          <Link
            key={code}
            to={localePath(basePath, code) + search}
            lang={code}
            hrefLang={code}
            aria-current={code === locale ? "true" : undefined}
            preventScrollReset
          >
            {label} {index === LANGUAGES.length - 1 ? "" : " / "}
          </Link>
        ))}
      </div>
    </footer>
  );
}
