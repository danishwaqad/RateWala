"use client";

import type { VendorWithProducts } from "@/types/database";
import { PaginatedVendorGrid } from "@/components/paginated-vendor-grid";
import { FilterSidebar } from "@/components/filter-sidebar";
import { useTranslation } from "@/components/locale-toggle";
import { RESTAURANT_AREAS, RESTAURANT_TYPES } from "@/lib/data/sample-data";
import { useMemo, useState } from "react";

interface MenuListingProps {
  vendors: VendorWithProducts[];
}

export function MenuListing({ vendors }: MenuListingProps) {
  const { t } = useTranslation();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    area: "",
    type: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      if (activeFilters.area && v.area !== activeFilters.area) return false;
      if (activeFilters.type) {
        const typeLower = activeFilters.type.toLowerCase();
        const hasType = v.products.some((p) => p.category.toLowerCase().includes(typeLower));
        if (!hasType) return false;
      }
      return true;
    });
  }, [vendors, activeFilters]);

  const filterGroups = [
    {
      key: "area",
      title: t("area"),
      options: RESTAURANT_AREAS.map((a) => ({ label: a, value: a })),
    },
    {
      key: "type",
      title: t("type"),
      options: RESTAURANT_TYPES.map((type) => ({ label: type, value: type })),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <FilterSidebar
        groups={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        filtersLabel={t("filters")}
      />

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
