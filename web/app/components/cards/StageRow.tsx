import { Link } from "react-router";
import type { StageSummary } from "~/data/stages.server";
import { formatDate, formatNumber, formatStageDay } from "~/lib/format";
import { localePath, useLocale, type Locale } from "~/lib/i18n";
import { placeName, routeLabel } from "~/lib/places";
import { strapiMedia } from "~/lib/strapi-media";

type StageRowProps = {
  stage: StageSummary;
  locale: Locale;
};

export default function StageRow({ stage }: StageRowProps) {
  const locale = useLocale();
  const { stats, coverImage } = stage;

  const route = routeLabel(stage, locale);

  const meta = [
    stage.stageNumber != null
      ? { text: formatStageDay(stage.stageNumber, locale) }
      : null,
    stage.date
      ? {
          text: formatDate(stage.date as string, locale, {
            day: "numeric",
            month: "short",
          }),
          className: "hidden md:inline",
        }
      : null,
    stats?.distanceKm != null
      ? { text: `${formatNumber(stats.distanceKm, locale)} km` }
      : null,
    stats?.elevationGainM != null
      ? {
          text: `↑ ${formatNumber(stats.elevationGainM, locale)} m`,
          className: "hidden md:inline",
        }
      : null,
  ].filter((item) => !!item);

  return (
    <Link
      className="stage-row"
      to={localePath(`/journal/${stage.slug}`, locale)}
    >
      <div className="flex justify-center items-center">
        {coverImage?.url ? (
          <img
            src={strapiMedia(coverImage?.url)}
            alt={coverImage?.alternativeText ?? ""}
            width={coverImage?.width ?? undefined}
            height={coverImage?.height ?? undefined}
            loading="lazy"
            className="object-cover h-full w-full"
          />
        ) : (
          <div className="image-placeholder h-full" aria-hidden="true" />
        )}
      </div>


      <div className="stage-info flex flex-col items-start gap-2">
        <p className="text-label-sm">
          {meta.map((item, i) => (
            <span key={i} className={item.className}>
              {i > 0 && " · "}
              {item.text}
            </span>
          ))}
        </p>

        <h3 className="text-h5">{stage.title}</h3>

        {route && <p className="text-ui hidden md:block">{route}</p>}
      </div>
    </Link>
  );
}
