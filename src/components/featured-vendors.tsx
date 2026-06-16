"use client";

import type { VendorWithProducts } from "@/types/database";
import { PaginatedVendorGrid } from "@/components/paginated-vendor-grid";
import { useTranslation } from "@/components/locale-toggle";

interface FeaturedVendorsProps {
  vendors: VendorWithProducts[];
}

export function FeaturedVendors({ vendors }: FeaturedVendorsProps) {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-4 py-8 md:py-10">
      <div className="mb-5">
        <h2 className="text-xl font-bold md:text-2xl">{t("topVendors")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("featuredSubtitle")}</p>
      </div>
      <PaginatedVendorGrid vendors={vendors} variant="featured" pageSize={6} />
    </section>
  );
}
