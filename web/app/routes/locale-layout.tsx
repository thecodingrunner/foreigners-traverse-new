import { Outlet } from "react-router";
import type { Route } from "./+types/locale-layout";
import { getLocale } from "~/lib/i18n";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { getRideTotals } from "~/data/stages.server";

export async function loader({ params }: Route.LoaderArgs) {
  const locale = getLocale(params.lang);
  const totals = await getRideTotals().catch(() => null);
  return { locale, totals };
}

export default function LocaleLayout({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex min-h-dvh flex-col">
            <Header totals={loaderData.totals} />
            <main className="flex-1"><Outlet /></main>
            <Footer />
        </div>
    );
}