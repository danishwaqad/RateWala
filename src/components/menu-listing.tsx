"use client";

import type { VendorWithProducts } from "@/types/database";
import { PaginatedVendorGrid } from "@/components/paginated-vendor-grid";
import { FilterSidebar } from "@/components/filter-sidebar";
import { useTranslation } from "@/components/locale-toggle";
import {
  getAreasFromVendors,
  vendorHasCategory,
  type FilterOption,
} from "@/lib/data/filters";
import { useMemo, useState } from "react";

interface MenuListingProps {
  vendors: VendorWithProducts[];
  categoryOptions: FilterOption[];
}

export function MenuListing({ vendors, categoryOptions }: MenuListingProps) {
  const { t } = useTranslation();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    area: "",
    type: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const areaOptions = useMemo(() => getAreasFromVendors(vendors), [vendors]);

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      if (activeFilters.area && v.area !== activeFilters.area) return false;
      if (activeFilters.type && !vendorHasCategory(v, activeFilters.type)) return false;
      return true;
    });
  }, [vendors, activeFilters]);

  const filterGroups = [
    {
      key: "area",
      title: t("area"),
      options: areaOptions,
    },
    {
      key: "type",
      title: t("category"),
      options: categoryOptions,
    },
  ].filter((group) => group.options.length > 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {filterGroups.length > 0 && (
        <FilterSidebar
          groups={filterGroups}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          filtersLabel={t("filters")}
        />
      )}

      <div className="flex-1">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">{t("noResults")}</p>
        ) : (
          <PaginatedVendorGrid vendors={filtered} variant="listing" pageSize={6} />
        )}
      </div>
    </div>
  );
}
