import { unstable_noStore as noStore } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { VendorReview } from "@/types/database";

export async function getVendorReviews(vendorId: string): Promise<VendorReview[]> {
  noStore();
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("vendor_reviews")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as VendorReview[];
}
