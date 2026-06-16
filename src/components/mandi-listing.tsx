"use client";

import type { VendorWithProducts } from "@/types/database";
import { PaginatedVendorGrid } from "@/components/paginated-vendor-grid";
import { FilterSidebar } from "@/components/filter-sidebar";
import { useTranslation } from "@/components/locale-toggle";
import { SUPPLIER_CATEGORIES } from "@/lib/data/sample-data";
import { useMemo, useState } from "react";

interface MandiListingProps {
  vendors: VendorWithProducts[];
}

export function MandiListing({ vendors }: MandiListingProps) {
  const { t } = useTranslation();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    category: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      if (!activeFilters.category) return true;
      const catLower = activeFilters.category.toLowerCase();
      return v.products.some((p) => p.category.toLowerCase().includes(catLower));
    });
  }, [vendors, activeFilters]);

  const filterGroups = [
    {
      key: "category",
      title: t("category"),
      options: SUPPLIER_CATEGORIES.map((c) => ({ label: c, value: c })),
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
