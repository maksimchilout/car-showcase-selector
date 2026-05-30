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

  return <CarSpecsContext.Provider value={value}>{children}</CarSpecsContext.Provider>;
}

export function CarSpecsTabs() {
  const { specGroups, activeTab, setActiveTab, isAll } = useCarSpecsContext();

  return (
    <div className="-mx-2 overflow-x-auto px-2 pb-1">
      <div className="flex min-w-max flex-wrap justify-center gap-2 md:min-w-0">
        {specGroups.map((g) => (
          <button
            key={g.label}
            type="button"
            onClick={() => setActiveTab(g.label)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
              activeTab === g.label
                ? "bg-[#C9A84C] text-black"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {g.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActiveTab(ALL_TAB)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
            isAll
              ? "bg-[#C9A84C] text-black"
              : "glass text-muted-foreground hover:text-foreground"
          }`}
        >
          Открыть все характеристики
        </button>
      </div>
    </div>
  );
}

function SpecRows({ items }: { items: SpecGroup["items"] }) {
  return (
    <dl className="divide-y divide-white/[0.06]">
      {items.map((s) => (
        <div key={s.label} className="flex items-baseline justify-between gap-6 py-3.5">
          <dt className="min-w-0 text-sm leading-snug text-muted-foreground">{s.label}</dt>
          <dd className="shrink-0 text-right font-serif text-base leading-snug">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SpecGroupBlock({ group, showHeading = true }: { group: SpecGroup; showHeading?: boolean }) {
  return (
    <div>
      {showHeading && (
        <h3 className="mb-4 font-serif text-xl tracking-wide text-foreground">{group.label}</h3>
      )}
      <SpecRows items={group.items} />
    </div>
  );
}

export function CarSpecsPanel() {
  const { specGroups, activeGroup, isAll, collapseAll } = useCarSpecsContext();

  return (
    <div className="mx-auto w-full max-w-2xl">
      {isAll ? (
        <>
          <div className="space-y-10">
            {specGroups.map((g) => (
              <SpecGroupBlock key={g.label} group={g} />
            ))}
          </div>
          <div className="mt-10 flex justify-center border-t border-white/[0.06] pt-8">
            <button
              type="button"
              onClick={collapseAll}
              className="rounded-full border border-white/10 bg-black/40 px-6 py-2.5 text-sm text-muted-foreground transition-colors hover:border-[#C9A84C]/40 hover:text-foreground"
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
