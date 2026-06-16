import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { CategoryGrid } from "@/components/category-grid";
import { FeaturedVendors } from "@/components/featured-vendors";
import { SectionHeader } from "@/components/section-header";
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

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Categories"
            title={t("categories")}
            subtitle={t("categoriesSubtitle")}
            className="mb-8"
          />
          <CategoryGrid categories={categories} />
        </div>
      </section>

      <FeaturedVendors vendors={featuredVendors} />
    </>
  );
}
