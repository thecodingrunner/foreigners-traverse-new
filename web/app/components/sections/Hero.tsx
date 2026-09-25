import { getLocale } from "~/lib/i18n";
import type { SectionOf } from "~/data/pages.server";
import type { RideTotals } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";

type Props = SectionOf<"ComponentSectionsHero"> & { totals?: RideTotals };

export default function Hero({
  heading,
  subheading,
  introduction,
  totals,
}: Props) {
  const locale = getLocale();
  const t = useT();
  const num = new Intl.NumberFormat(locale === "ja" ? "ja-JP" : "en-GB");

  const stats = totals && [
    { label: t.stats.distance, value: `${num.format(totals.distanceKm)} km` },
    { label: t.stats.days, value: num.format(totals.days) },
    { label: t.stats.climb, value: `${num.format(totals.elevationGainM)} m` },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-background hero-height">
      {/* Sun */}
      <div className="sun-gradient flex flex-col items-center justify-center gap-10">
        {/* Main title */}
        <h1 className={`text-hero text-accent-foreground text-center w-full`}>
          {heading}
        </h1>

        <p className="text-body text-accent-foreground text-center w-full">
          {subheading}
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="text-body text-foreground text-right absolute left-5 right-5 md:right-auto md:left-22 bottom-6 md:bottom-14 flex justify-between md:gap-10">
          {stats?.map((s) => (
            <div key={s.label} className="flex flex-col items-start">
              <p className="text-label text-muted-foreground">{s.label}</p>
              <p className="text-data text-[22px]">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Introduction */}
      <p className="text-body text-foreground md:text-right absolute left-5 right-5 md:left-auto md:right-22 bottom-21 md:bottom-14 md:w-[20vw]">
        {introduction}
      </p>
    </div>
  );
}
