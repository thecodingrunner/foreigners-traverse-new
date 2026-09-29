import type { RideTotals, StageDetail } from "~/data/stages.server";
import { useT } from "~/lib/dictionary";
import { formatDate, formatStageDay, formatStartEnd } from "~/lib/format";
import { useLocale } from "~/lib/i18n";
import StageData from "./StageData";

type StageHeaderProps = {
  stage: StageDetail;
  totals: RideTotals;
};

export default function StageHeader({ stage, totals }: StageHeaderProps) {
  const t = useT();
  const locale = useLocale();

  const meta = [
    stage.stageNumber != null
      ? formatStageDay(stage.stageNumber, locale)
      : null,
    stage.date
      ? formatDate(stage.date as string, locale, {
          day: "numeric",
          month: "short",
        })
      : null,
    stage.startName != null && stage.endName != null
      ? formatStartEnd(stage.startName, stage.endName)
      : null,
  ].filter((item) => !!item);

  return (
    <section className="">
      <div className="flex flex-col items-start gap-4">
        {meta.length > 0 && (
          <p className="flex gap-2 items-center justify-start text-accent text-label">
            {meta.join(" · ")}
          </p>
        )}

        <h1 className="text-h1">{stage.title}</h1>

        <p className="text-body text-muted-foreground">{stage.excerpt}</p>
      </div>

      <div className="border-t border-t-nibi mt-5 md:mt-10 border-b border-b-border">
        <StageData stage={stage} totals={totals} />
      </div>
    </section>
  );
}
