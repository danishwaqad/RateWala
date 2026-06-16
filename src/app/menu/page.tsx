import type { Metadata } from "next";
import { MenuListing } from "@/components/menu-listing";
import { getVendors } from "@/lib/data/vendors";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Restaurant Menus — RateWala",
  description: "Browse restaurant menus and prices in your city.",
};

export default async function MenuPage() {
  const vendors = await getVendors("restaurant");

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("menuPageTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("menuPageSubtitle")}</p>
      </div>
      <MenuListing vendors={vendors} />
    </div>
  );
}
