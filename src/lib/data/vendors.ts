import { unstable_noStore as noStore } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getMockCategories,
  getMockFeaturedVendors,
  getMockVendorBySlug,
  getMockVendors,
} from "@/lib/data/sample-data";
import { mergeProductCategories } from "@/lib/data/categories";
import type { Category, Product, Vendor, VendorWithProducts } from "@/types/database";

export async function getVendors(type?: "restaurant" | "supplier"): Promise<VendorWithProducts[]> {
  noStore();
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return getMockVendors(type);
  }

  let query = supabase.from("vendors").select("*").order("rating", { ascending: false });
  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  const vendors = data as import("@/types/database").Vendor[] | null;

  if (error || !vendors?.length) {
    return getMockVendors(type);
  }

  const vendorIds = vendors.map((v) => v.id);
  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .in("vendor_id", vendorIds);

  const products = productsData as import("@/types/database").Product[] | null;

  return vendors.map((vendor) => {
    const vendorProducts = products?.filter((p) => p.vendor_id === vendor.id) ?? [];
    const min_price =
      vendorProducts.length > 0 ? Math.min(...vendorProducts.map((p) => p.price)) : undefined;
    return { ...vendor, products: vendorProducts, min_price };
  });
}

export async function getVendorBySlug(slug: string): Promise<VendorWithProducts | null> {
  noStore();
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return getMockVendorBySlug(slug);
  }

  const { data: vendorData, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("slug", slug)
    .single();

  const vendor = vendorData as Vendor | null;

  if (error || !vendor) {
    return getMockVendorBySlug(slug);
  }

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .eq("vendor_id", vendor.id)
    .order("updated_at", { ascending: false });

  const products = (productsData as Product[] | null) ?? [];

  const min_price =
    products.length > 0 ? Math.min(...products.map((p) => p.price)) : undefined;

  return { ...vendor, products, min_price };
}

export async function getFeaturedVendors(): Promise<VendorWithProducts[]> {
  noStore();
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return getMockFeaturedVendors();
  }

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("created_at", { ascending: false });

  const vendors = data as Vendor[] | null;

  if (error || !vendors?.length) {
    return getMockFeaturedVendors();
  }

  const vendorIds = vendors.map((v) => v.id);
  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .in("vendor_id", vendorIds);

  const products = productsData as Product[] | null;

  return vendors.map((vendor) => {
    const vendorProducts = products?.filter((p) => p.vendor_id === vendor.id) ?? [];
    const min_price =
      vendorProducts.length > 0 ? Math.min(...vendorProducts.map((p) => p.price)) : undefined;
    return { ...vendor, products: vendorProducts, min_price };
  });
}

export async function getCategories(): Promise<Category[]> {
  noStore();
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return getMockCategories();
  }

  const [{ data: catalog, error }, { data: productRows }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("products").select("category"),
  ]);

  if (error) {
    return getMockCategories();
  }

  const catalogCategories = (catalog as Category[] | null) ?? [];
  const productSlugs = (productRows ?? []).map((row) => row.category as string);

  const merged = mergeProductCategories(catalogCategories, productSlugs);
  return merged.length > 0 ? merged : getMockCategories();
}

export async function searchVendors(query: string): Promise<VendorWithProducts[]> {
  const all = await getVendors();
  const q = query.toLowerCase();

  return all.filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.area.toLowerCase().includes(q) ||
      v.products.some(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
  );
}
