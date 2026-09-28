import { Link } from "react-router";
import { useT } from "~/lib/dictionary";

export default function ExploreCTA() {
  const t = useT();

  return (
    <div className="padding-x margin-y">
      <div className="explore-cta-card bg-secondary text-secondary-foreground">
        <div className="explore-cta-card-image">

        </div>

        <div className="p-5 lg:p-12 flex flex-col items-start justify-center gap-4">
          <p className="text-label text-accent-light text-uppercase">{t.exploreCta.label}</p>
          <h3 className="text-h3 font-extrabold">{t.exploreCta.title}</h3>
          <p className="text-body  text-secondary-foreground/80">{t.exploreCta.subtitle}</p>
          <div className="flex gap-4 items-center justify-start">
            <Link className="btn-primary flex gap-1 items-center" to="">{t.exploreCta.buttonPrimary} <span>→</span></Link>
            <Link className="hidden md:block text-body text-secondary-foreground/80" to="">{t.exploreCta.buttonSecondary}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
