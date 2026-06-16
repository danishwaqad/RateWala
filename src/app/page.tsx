import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { CategoryGrid } from "@/components/category-grid";
import { FeaturedVendors } from "@/components/featured-vendors";
import { getCategories, getFeaturedVendors } from "@/lib/data/vendors";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredVendors] = await Promise.all([
    getCategories(),
    getFeaturedVendors(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsSection />

      <section className="border-t bg-slate-50/80 py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="mb-5">
            <h2 className="text-xl font-bold md:text-2xl">{t("categories")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("categoriesSubtitle")}</p>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      <FeaturedVendors vendors={featuredVendors} />
    </>
  );
}
