import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** На светлой теме логотип затемняется (brightness-0), на тёмной — оригинал. */
export function ElectroCarLogo({ className }: Props) {
  return (
    <img
      src="/logo.png"
      alt="Electro-car.by"
      className={cn(
        "h-8 w-auto object-contain sm:h-9",
        "brightness-0 transition-[filter] duration-300 dark:brightness-100",
        className,
      )}
    />
  );
}
