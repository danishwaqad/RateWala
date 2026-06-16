"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/locale-toggle";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative border-b bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal">
            {t("tagline")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button size="lg" variant="default" asChild className="group">
              <Link href="/menu">
                {t("viewMenu")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="group">
              <Link href="/mandi">
                {t("mandiRates")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
