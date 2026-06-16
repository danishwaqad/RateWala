"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/components/locale-toggle";

export function StaleRatesBadge({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <Badge
      variant="outline"
      className={`border-amber-300 bg-amber-50 text-amber-800 ${className ?? ""}`}
    >
      {t("staleRatesBadge")}
    </Badge>
  );
}

export function StaleRatesNotice({ children }: { children?: ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {children ?? t("staleRatesNotice")}
    </div>
  );
}
