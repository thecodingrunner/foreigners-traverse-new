import { useEffect, useState, type RefObject } from "react";
import { useLocation } from "react-router";
import { localePath, stripLocale, type Locale } from "~/lib/i18n"; 

/** Active check that understands ?view= as well as the path. */
export function useIsNavActive() {
    const { pathname, search } = useLocation();
    const current = stripLocale(pathname);
    const currentView = new URLSearchParams(search).get("view");

    return (path: string) => {
        const [targetPath, targetQuery = ""] = path.split("?");
        const targetView = new URLSearchParams(targetQuery).get("view");
        const pathMatches = current === targetPath || current.startsWith(`${targetPath}/`);
        return pathMatches && currentView === targetView;
    };
}

/** The current page in another language. */
export function useLanguageHref() {
    const { pathname, search } = useLocation();
    const basePath = stripLocale(pathname);
    return (code: Locale) => localePath(basePath, code) + search;
}

/** Hides on scroll down, shows on scroll up; never hides while focus is inside. */
export function useHideOnScroll(ref: RefObject<HTMLElement | null>, threshold = 80) {
    const [hidden, setHidden] = useState(false);
    useEffect(() => {
        let last = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            const focusInside = ref.current?.contains(document.activeElement);
            setHidden(y > threshold && y > last && !focusInside);
            last = y;
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [ref, threshold]);
    return hidden;
}

