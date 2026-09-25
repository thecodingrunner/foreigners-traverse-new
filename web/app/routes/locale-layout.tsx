import { Outlet } from "react-router";
import type { Route } from "./+types/locale-layout";
import { getLocale } from "~/lib/i18n";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";

export function loader({ params }: Route.LoaderArgs) {
    return { locale: getLocale(params.lang) };
}

export default function LocaleLayout() {
    return (
        <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1"><Outlet /></main>
            <Footer />
        </div>
    );
}