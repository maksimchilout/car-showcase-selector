import { useId } from "react";

/** Две шевроны Citroën: одна над другой, обе смотрят вверх */
export function CitroenLogo({ className = "h-8 w-7" }: { className?: string }) {
  const gradId = useId();

  return (
    <svg viewBox="0 0 32 31" className={className} aria-label="Citroën">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8CE7F" />
          <stop offset="100%" stopColor="#9A7F37" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M16 2 L3 15 L7 15 L16 7 L25 15 L29 15 Z"
      />
      <path
        fill={`url(#${gradId})`}
        d="M16 16 L3 29 L7 29 L16 21 L25 29 L29 29 Z"
      />
    </svg>
  );
}
