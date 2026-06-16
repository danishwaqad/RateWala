"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { useTranslation } from "@/components/locale-toggle";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden border-b mesh-hero">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-orange-400/15 blur-3xl" />

      <div className="container relative mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-white/70 px-4 py-1.5 text-xs font-semibold text-teal-700 shadow-soft backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {t("tagline")}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.1]">
            Every Price.{" "}
            <span className="text-gradient">One Platform.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg md:leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar size="lg" />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="group w-full rounded-xl shadow-glow sm:w-auto">
              <Link href="/menu">
                {t("viewMenu")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full rounded-xl bg-white/80 sm:w-auto">
              <Link href="/mandi">
                {t("mandiRates")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground md:gap-6 md:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 shadow-soft">
              <ShieldCheck className="h-4 w-4 text-teal" />
              Verified businesses
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 shadow-soft">
              <Zap className="h-4 w-4 text-orange" />
              Live price updates
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 shadow-soft">
              Free to list
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
