import { Link } from "react-router";
import type { RideTotals, Stages } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import StageRow from "../cards/StageRow";
import { useEffect } from "react";
import { useLocale } from "~/lib/i18n";
import FeaturedStageCard from "../cards/FeaturedStageCard";

type FeaturedStagesProps = {
  latestStages?: Stages;
  featuredStages?: Stages;
  totals?: RideTotals;
};

export default function FeaturedStages({
  latestStages,
  featuredStages,
  totals,
}: FeaturedStagesProps) {
  const t = useT();

  const [firstStage, ...otherStages] = featuredStages ?? [];

  const locale = useLocale();

  useEffect(() => {
    console.log("featured stages: ", featuredStages);
    console.log("first stage: ", firstStage);
    console.log("other stages: ", otherStages);
  }, [featuredStages, firstStage, otherStages]);

  return (
    <div className="padding-x margin-y">
      <div className="flex items-end justify-between border-b border-border pb-5 mb-10">
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-h3">{t.latestStages.title}</h3>
          <p className="text-muted-foreground text-ui">
            {t.latestStages.subtitle}
          </p>
        </div>

        <Link to="/journal" className="link-text">
          {t.latestStages.all(totals?.days ?? 0)} →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>{firstStage && <FeaturedStageCard stage={firstStage} />}</div>

        {otherStages && (
          <div className="flex flex-col gap-2">
            {otherStages.map((stage) => (
              <StageRow key={stage?.slug} stage={stage} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
