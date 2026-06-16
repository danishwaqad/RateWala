"use client";

import { Store, Truck, Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/components/locale-toggle";
import { STATS } from "@/lib/data/sample-data";

export function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    { icon: Store, value: `${STATS.restaurants}+`, label: t("restaurants") },
    { icon: Truck, value: `${STATS.suppliers}+`, label: t("suppliers") },
    { icon: Tags, value: `${STATS.rates.toLocaleString()}+`, label: t("rates") },
  ];

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
