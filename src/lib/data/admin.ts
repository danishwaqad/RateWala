import { unstable_noStore as noStore } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { Vendor } from "@/types/database";

export async function getAllVendorsForAdmin(): Promise<Vendor[]> {
  noStore();
  const supabase = createServiceRoleClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
}
