import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card/80 text-foreground shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-card hover:text-primary hover:shadow-md",
        className,
      )}
    >
      {isDark ? <Sun className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} /> : <Moon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />}
    </button>
  );
}
