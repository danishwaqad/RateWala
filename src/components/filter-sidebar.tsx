"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  key: string;
  title: string;
  options: FilterOption[];
}

interface FilterSidebarProps {
  groups: FilterGroup[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  filtersLabel: string;
}

function FilterContent({
  groups,
  activeFilters,
  onFilterChange,
}: Omit<FilterSidebarProps, "filtersLabel">) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.key}>
          <h3 className="mb-3 text-sm font-semibold">{group.title}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onFilterChange(group.key, "")}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                !activeFilters[group.key]
                  ? "bg-teal text-white border-teal"
                  : "bg-white hover:border-teal hover:text-teal"
              )}
            >
              All
            </button>
            {group.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFilterChange(group.key, option.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                  activeFilters[group.key] === option.value
                    ? "bg-teal text-white border-teal"
                    : "bg-white hover:border-teal hover:text-teal"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  const { filtersLabel, ...filterProps } = props;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 rounded-xl border bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold">{filtersLabel}</h2>
          <FilterContent {...filterProps} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4" />
              {filtersLabel}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>{filtersLabel}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent {...filterProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export function useFilters<T extends Record<string, string>>(
  initial: T
): [T, (group: string, value: string) => void] {
  const [filters, setFilters] = useState<T>(initial);

  const handleFilterChange = (group: string, value: string) => {
    setFilters((prev) => ({ ...prev, [group]: value }));
  };

  return [filters, handleFilterChange];
}
