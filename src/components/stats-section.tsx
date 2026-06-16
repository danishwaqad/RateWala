"use client";

import { Store, Truck, Tags } from "lucide-react";
import { useTranslation } from "@/components/locale-toggle";
import { STATS } from "@/lib/data/sample-data";
import { cn } from "@/lib/utils";

export function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    { icon: Store, value: `${STATS.restaurants}+`, label: t("restaurants"), accent: "from-teal-500/10 to-teal-600/5" },
    { icon: Truck, value: `${STATS.suppliers}+`, label: t("suppliers"), accent: "from-orange-500/10 to-orange-600/5" },
    { icon: Tags, value: `${STATS.rates.toLocaleString()}+`, label: t("rates"), accent: "from-slate-500/10 to-slate-600/5" },
  ];

  return (
    <section className="container relative z-10 mx-auto -mt-8 px-4 pb-4 md:-mt-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "group rounded-2xl border border-white/80 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
              `bg-gradient-to-br ${stat.accent}`
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-teal shadow-soft ring-1 ring-border/50 transition-transform group-hover:scale-105">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
