import { CAR_HERO_FACTS_COMMON, type CarHeroFacts } from "@/lib/cars";
import { WARRANTY_PDF_URL } from "@/lib/contact";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

type Props = {
  facts: CarHeroFacts;
  className?: string;
  style?: CSSProperties;
  compact?: boolean;
};

export function CarHeroFacts({ facts, className, style, compact }: Props) {
  const labeled = [
    { label: "Габариты", value: facts.dimensions },
    { label: "Год выпуска", value: facts.modelYear },
    { label: "Коробка передач", value: facts.gearbox },
  ] as const;

  return (
    <ul
      style={style}
      className={cn(
        "space-y-2 leading-relaxed text-muted-foreground",
        compact ? "text-[0.9rem]" : "mt-6 text-[1.05rem]",
        className,
      )}
    >
      {labeled.map(({ label, value }) => (
        <li key={label}>
          <span className="text-foreground/75">{label}:</span> {value}
        </li>
      ))}
      {CAR_HERO_FACTS_COMMON.map((line) => (
        <li key={line}>
          {line}
          {line === "Доступны финансовые программы" && (
            <a
              href={WARRANTY_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto mt-1 block transition-colors hover:text-gold"
            >
              Положение о гарантии
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
