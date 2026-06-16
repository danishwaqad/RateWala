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
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className={cn("space-y-5", className)}>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {visible.map((category) => {
          const Icon = iconMap[category.icon ?? "package"] ?? Package;
          return (
            <Link key={category.id} href={`/search?q=${encodeURIComponent(category.slug)}`}>
              <Card className="group h-full border-slate-200 transition-all hover:border-teal/40 hover:shadow-sm">
                <CardContent className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-teal transition-colors group-hover:bg-teal group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-center">{category.name}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between border-t border-slate-200 pt-4">
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
