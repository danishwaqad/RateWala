"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Utensils,
  Flame,
  Pizza,
  Droplet,
  Drumstick,
  Wheat,
  Soup,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/locale-toggle";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

const iconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  flame: Flame,
  pizza: Pizza,
  droplet: Droplet,
  drumstick: Drumstick,
  wheat: Wheat,
  bowl: Soup,
  package: Package,
};

interface CategoryGridProps {
  categories: Category[];
  className?: string;
  pageSize?: number;
}

export function CategoryGrid({ categories, className, pageSize = PAGE_SIZE }: CategoryGridProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [categories.length, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const visible = categories.slice(start, start + pageSize);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {visible.map((category) => {
          const Icon = iconMap[category.icon ?? "package"] ?? Package;
          return (
            <Link key={category.id} href={`/search?q=${encodeURIComponent(category.slug)}`}>
              <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white p-4 shadow-soft card-hover sm:p-5">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4 text-teal" />
                </div>
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal ring-1 ring-teal/10 transition-all group-hover:from-teal-500 group-hover:to-teal-600 group-hover:text-white group-hover:shadow-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{category.name}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between border-t border-border/60 pt-5">
          <p className="text-sm text-muted-foreground">
            {t("showingCategories")
              .replace("{from}", String(start + 1))
              .replace("{to}", String(Math.min(start + pageSize, categories.length)))
              .replace("{total}", String(categories.length))}
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
            <span className="text-sm font-medium px-2 tabular-nums">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
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
