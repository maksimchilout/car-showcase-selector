import { Phone } from "lucide-react";
import { PHONES } from "@/lib/contact";

type PhoneLinksProps = {
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
  compact?: boolean;
};

export function PhoneLinks({
  className = "",
  linkClassName = "tracking-wider transition-colors hover:text-[#C9A84C]",
  iconClassName = "h-3.5 w-3.5 shrink-0 text-[#C9A84C]",
  compact = false,
}: PhoneLinksProps) {
  const iconCls = compact ? "h-4 w-4 shrink-0 text-[#C9A84C]" : iconClassName;

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {PHONES.map(({ display, tel }) => (
        <a
          key={tel}
          href={`tel:${tel}`}
          className={`flex items-center gap-2 text-muted-foreground ${linkClassName} ${compact ? "text-sm" : "text-xs"}`}
        >
          <Phone className={iconCls} />
          {display}
        </a>
      ))}
    </div>
  );
}
