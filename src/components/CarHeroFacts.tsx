import { CAR_HERO_FACTS_COMMON, type CarHeroFacts } from "@/lib/cars";
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
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}
