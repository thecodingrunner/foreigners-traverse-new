import { Link } from "react-router";
import { useLanguageHref } from "~/hooks/navigation";
import { useT } from "~/lib/dictionary";
import { localePath, useLocale } from "~/lib/i18n";
import { LANGUAGES } from "~/lib/navigation";
import { useExplore } from "~/stores/explore-context";
import CameraModeControl from "./CameraModeControl";

const MODES = ["overview", "follow", "orbit"] as const;

export default function ExploreTopBar() {
  const locale = useLocale();
  const t = useT();
  const languageHref = useLanguageHref();

  const mode = useExplore((s) => s.mode);
  const setMode = useExplore((s) => s.setMode);

  return (
    <header className="explore-topbar" data-scene-cover>
      <div className="flex items-center gap-5">
        <Link to={localePath("/journal", locale)} className="text-ui">
          ← {t.explore.back}
        </Link>
        <span className="explore-divider hidden md:block" aria-hidden="true" />
        <span className="text-header hidden md:block font-extrabold">
          {t.header.title.main}
        </span>
      </div>

      <CameraModeControl />

      <div className="language-switch">
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
    </header>
  );
}
