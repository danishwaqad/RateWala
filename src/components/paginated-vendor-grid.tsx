"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VendorWithProducts } from "@/types/database";
import { VendorCard } from "@/components/vendor-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/locale-toggle";

const PAGE_SIZE = 6;

interface PaginatedVendorGridProps {
  vendors: VendorWithProducts[];
  variant?: "featured" | "listing";
  pageSize?: number;
}

export function PaginatedVendorGrid({
  vendors,
  variant = "listing",
  pageSize = PAGE_SIZE,
}: PaginatedVendorGridProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(vendors.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [vendors.length, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const visible = vendors.slice(start, start + pageSize);

  if (vendors.length === 0) {
    return <p className="py-12 text-center text-muted-foreground">{t("noResults")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} variant={variant} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between border-t border-border/60 pt-5">
          <p className="text-sm text-muted-foreground">
            {t("showingVendors")
              .replace("{from}", String(start + 1))
              .replace("{to}", String(Math.min(start + pageSize, vendors.length)))
              .replace("{total}", String(vendors.length))}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("previous")}
            </Button>
            <span className="text-sm font-medium px-2">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              {t("next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
