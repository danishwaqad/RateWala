import { unstable_noStore as noStore } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SAMPLE_PRODUCTS, SAMPLE_VENDORS } from "@/lib/data/sample-data";

export interface PlatformStats {
  restaurants: number;
  suppliers: number;
  products: number;
}

function getMockStats(): PlatformStats {
  const restaurants = SAMPLE_VENDORS.filter((v) => v.type === "restaurant").length;
  const suppliers = SAMPLE_VENDORS.filter((v) => v.type === "supplier").length;
  return {
    restaurants,
    suppliers,
    products: SAMPLE_PRODUCTS.length,
  };
}

export async function getPlatformStats(): Promise<PlatformStats> {
  noStore();
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return getMockStats();
  }

  const [restaurantRes, supplierRes, productRes] = await Promise.all([
    supabase.from("vendors").select("id", { count: "exact", head: true }).eq("type", "restaurant"),
    supabase.from("vendors").select("id", { count: "exact", head: true }).eq("type", "supplier"),
    supabase.from("products").select("id", { count: "exact", head: true }),
  ]);

  if (restaurantRes.error || supplierRes.error || productRes.error) {
    return getMockStats();
  }

  return {
    restaurants: restaurantRes.count ?? 0,
    suppliers: supplierRes.count ?? 0,
    products: productRes.count ?? 0,
  };
}
