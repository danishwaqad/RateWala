import type { Category, VendorWithProducts } from "@/types/database";

export interface FilterOption {
  label: string;
  value: string;
}

export function getAreasFromVendors(vendors: VendorWithProducts[]): FilterOption[] {
  const areas = Array.from(new Set(vendors.map((v) => v.area).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );

  return areas.map((area) => ({ label: area, value: area }));
}

export function getCategoriesAsFilterOptions(categories: Category[]): FilterOption[] {
  return categories.map((category) => ({
    label: category.name,
    value: category.slug,
  }));
}

export function vendorHasCategory(vendor: VendorWithProducts, categorySlug: string): boolean {
  return vendor.products.some((product) => product.category === categorySlug);
}
