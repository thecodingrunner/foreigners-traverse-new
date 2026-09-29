import { useT } from "~/lib/dictionary";

type TableOfContentsProps = {
  headings: {
    id: string;
    text: string;
    level: number;
  }[];
};

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const t = useT();
  if (headings.length === 0) return null;

  return (
    <nav aria-label={t.stage.onThisPage}>
      <p className="text-label uppercase text-muted-foreground">
        {t.stage.onThisPage}
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="text-ui hover:text-accent">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
