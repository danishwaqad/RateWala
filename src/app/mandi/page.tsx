import type { Metadata } from "next";
import { MandiListing } from "@/components/mandi-listing";
import { getCategories, getVendors } from "@/lib/data/vendors";
import { getCategoriesAsFilterOptions } from "@/lib/data/filters";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wholesale Rates — RateWala",
  description: "Compare wholesale supplier rates for oil, chicken, rice and more.",
};

export default async function MandiPage() {
  const [vendors, categories] = await Promise.all([
    getVendors("supplier"),
    getCategories(),
  ]);

  const categoryOptions = getCategoriesAsFilterOptions(
    categories.filter((category) => category.type === "wholesale")
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("mandiPageTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("mandiPageSubtitle")}</p>
      </div>
      <MandiListing vendors={vendors} categoryOptions={categoryOptions} />
    </div>
  );
}
