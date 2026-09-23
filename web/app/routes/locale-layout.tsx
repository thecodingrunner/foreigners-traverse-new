import { Outlet } from "react-router";
import type { Route } from "./+types/locale-layout";
import { getLocale } from "~/lib/i18n";

export function loader({ params }: Route.LoaderArgs) {
    return { locale: getLocale(params.lang) };
}

export default function LocaleLayout() {
    return <Outlet />;
}