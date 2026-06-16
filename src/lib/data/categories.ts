import { SAMPLE_CATEGORIES } from "@/lib/data/sample-data";
import { formatCategoryLabel } from "@/lib/utils";
import type { Category, CategoryType } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface CategoryOption {
  value: string;
  label: string;
}

export function buildCategoryOptions(
  categoryType: CategoryType,
  productCategories: string[],
  platformCategories?: { name: string; slug: string }[]
): CategoryOption[] {
  const platform =
    platformCategories ??
    SAMPLE_CATEGORIES.filter((c) => c.type === categoryType).map((c) => ({
      name: c.name,
      slug: c.slug,
    }));

  const map = new Map<string, CategoryOption>();

  for (const cat of platform) {
    map.set(cat.slug, { value: cat.slug, label: cat.name });
  }

  for (const slug of productCategories) {
    if (!slug || slug === "general") continue;
    if (!map.has(slug)) {
      map.set(slug, { value: slug, label: formatCategoryLabel(slug) });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export async function ensureCategoryInCatalog(
  supabase: SupabaseClient,
  slug: string,
  categoryType: CategoryType
) {
  if (!slug || slug === "general") return;

  const { data: existing } = await supabase
    .from("categories")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) return;

  await supabase.from("categories").insert({
    name: formatCategoryLabel(slug),
    slug,
    type: categoryType,
    icon: categoryType === "food" ? "utensils" : "package",
  });
}

export function mergeProductCategories(
  catalog: Category[],
  productCategories: string[]
): Category[] {
  const map = new Map<string, Category>();

  for (const cat of catalog) {
    map.set(cat.slug, cat);
  }

  for (const slug of productCategories) {
    if (!slug || slug === "general" || map.has(slug)) continue;
    map.set(slug, {
      id: `product-${slug}`,
      name: formatCategoryLabel(slug),
      slug,
      type: "food",
      icon: "utensils",
    });
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}
