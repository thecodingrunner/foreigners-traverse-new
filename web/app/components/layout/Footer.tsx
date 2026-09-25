import { NavLink, useLocation } from "react-router";
import { useT } from "~/lib/dictionary";
import { localePath, stripLocale, useLocale } from "~/lib/i18n";

const NAV = [
  { key: "journal", path: "/journal" },
  { key: "explore", path: "/explore" },
  { key: "github", path: "https://github.com/thecodingrunner/foreigners-traverse-new" },
] as const;

export default function Footer() {
  const locale = useLocale();
  const t = useT();
  const { pathname, search } = useLocation();
  const basePath = stripLocale(pathname);
    
    return (
        <footer className="py-10 px-22 flex justify-between items-end border-t border-border mt-20" >
            <div>
                <p className="text-body font-extrabold">
                    {t.footer.title}
                </p>

                <p className="text-body text-muted-foreground">
                    {t.footer.subtitle}
                </p>
            </div>

            <nav className="flex gap-8 text-ui">
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
        </footer>
    )
}