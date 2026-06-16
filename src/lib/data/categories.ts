import { SAMPLE_CATEGORIES } from "@/lib/data/sample-data";
import { formatCategoryLabel } from "@/lib/utils";
import type { CategoryType } from "@/types/database";
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
): Promise<{ ok: boolean; error?: string }> {
  if (!slug || slug === "general") return { ok: true };

  const { data: existing } = await supabase
    .from("categories")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) return { ok: true };

  const { error } = await supabase.from("categories").insert({
    name: formatCategoryLabel(slug),
    slug,
    type: categoryType,
    icon: categoryType === "food" ? "utensils" : "package",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export function categoriesToOptions(categories: { name: string; slug: string }[]): CategoryOption[] {
  return categories.map((cat) => ({ value: cat.slug, label: cat.name }));
}
