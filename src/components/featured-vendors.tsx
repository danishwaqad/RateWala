"use client";

import type { VendorWithProducts } from "@/types/database";
import { PaginatedVendorGrid } from "@/components/paginated-vendor-grid";
import { SectionHeader } from "@/components/section-header";
import { useTranslation } from "@/components/locale-toggle";

interface FeaturedVendorsProps {
  vendors: VendorWithProducts[];
}

export function FeaturedVendors({ vendors }: FeaturedVendorsProps) {
  const { t } = useTranslation();

  return (
    <section className="border-t bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Discover"
          title={t("topVendors")}
          subtitle={t("featuredSubtitle")}
          className="mb-8"
        />
        <PaginatedVendorGrid vendors={vendors} variant="featured" pageSize={6} />
      </div>
    </section>
  );
}
