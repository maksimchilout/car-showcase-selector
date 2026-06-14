import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { SpecGroup } from "@/lib/cars";

const ALL_TAB = "__all__";

type CarSpecsContextValue = {
  specGroups: SpecGroup[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeGroup: SpecGroup | undefined;
  isAll: boolean;
  collapseAll: () => void;
};

const CarSpecsContext = createContext<CarSpecsContextValue | null>(null);

function useCarSpecsContext() {
  const ctx = useContext(CarSpecsContext);
  if (!ctx) throw new Error("CarSpecs components must be used within CarSpecsRoot");
  return ctx;
}

type CarSpecsRootProps = {
  specGroups: SpecGroup[];
  sectionRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

export function CarSpecsRoot({ specGroups, sectionRef, children }: CarSpecsRootProps) {
  const defaultTab = specGroups[0]?.label ?? ALL_TAB;
  const [activeTab, setActiveTab] = useState(defaultTab);
  const activeGroup = specGroups.find((g) => g.label === activeTab);
  const isAll = activeTab === ALL_TAB;

  const collapseAll = useCallback(() => {
    setActiveTab(defaultTab);
    requestAnimationFrame(() => {
      sectionRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [defaultTab, sectionRef]);

  const value = useMemo(
    () => ({
      specGroups,
      activeTab,
      setActiveTab,
      activeGroup,
      isAll,
      collapseAll,
    }),
    [specGroups, activeTab, activeGroup, isAll, collapseAll],
  );

  return (
    <CarSpecsContext.Provider value={value}>
      <div className="car-specs">{children}</div>
    </CarSpecsContext.Provider>
  );
}

export function CarSpecsTabs() {
  const { specGroups, activeTab, setActiveTab, isAll } = useCarSpecsContext();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {specGroups.map((g) => (
        <button
          key={g.label}
          type="button"
          onClick={() => setActiveTab(g.label)}
          className={`rounded-full px-4 py-2 text-sm transition-colors touch-manipulation ${
            activeTab === g.label
              ? "bg-primary text-primary-foreground"
              : "glass text-muted-foreground hover:text-foreground"
          }`}
        >
          {g.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setActiveTab(ALL_TAB)}
        className={`rounded-full px-4 py-2 text-sm transition-colors touch-manipulation ${
          isAll
            ? "bg-primary text-primary-foreground"
            : "glass text-muted-foreground hover:text-foreground"
        }`}
      >
        Открыть все характеристики
      </button>
    </div>
  );
}

function SpecRows({ items }: { items: SpecGroup["items"] }) {
  return (
    <dl className="overflow-hidden rounded-lg border border-border">
      {items.map((s, i) => (
        <div
          key={s.label}
          className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
            i % 2 === 0 ? "bg-card" : "bg-muted/30"
          }`}
        >
          <dt className="text-sm leading-snug text-muted-foreground">{s.label}</dt>
          <dd className="font-medium leading-snug text-foreground sm:text-right">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SpecGroupBlock({ group, showHeading = true }: { group: SpecGroup; showHeading?: boolean }) {
  return (
    <div>
      {showHeading && (
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
          {group.label}
        </h3>
      )}
      <SpecRows items={group.items} />
    </div>
  );
}

export function CarSpecsPanel() {
  const { specGroups, activeGroup, isAll, collapseAll } = useCarSpecsContext();

  return (
    <div className="mx-auto w-full max-w-6xl">
      {isAll ? (
        <>
          <div className="space-y-10">
            {specGroups.map((g) => (
              <SpecGroupBlock key={g.label} group={g} />
            ))}
          </div>
          <div className="mt-10 flex justify-center border-t border-border pt-8">
            <button
              type="button"
              onClick={collapseAll}
              className="rounded-full border border-border bg-muted/60 px-6 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Свернуть все характеристики
            </button>
          </div>
        </>
      ) : activeGroup ? (
        <SpecGroupBlock group={activeGroup} showHeading />
      ) : null}
    </div>
  );
}
