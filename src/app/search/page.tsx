import Link from "next/link";
import { VendorCard } from "@/components/vendor-card";
import { searchVendors } from "@/lib/data/vendors";
import { t } from "@/lib/i18n";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const results = query ? await searchVendors(query) : [];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold">
        {query ? `Results for "${query}"` : "Search"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {query
          ? `${results.length} result${results.length !== 1 ? "s" : ""} found`
          : "Search for food items, groceries, and wholesale products"}
      </p>

      {query && results.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-muted-foreground">{t("noResults")}</p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium text-teal hover:underline">
            {t("backHome")}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} variant="listing" />
          ))}
        </div>
      )}
    </div>
  );
}
