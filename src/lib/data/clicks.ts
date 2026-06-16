import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

function getWeekStart(): string {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start.toISOString();
}

export async function getWeeklyClickCount(vendorId: string): Promise<number> {
  noStore();
  const supabase = await createClient();
  const weekStart = getWeekStart();

  const { count, error } = await supabase
    .from("clicks")
    .select("id", { count: "exact", head: true })
    .eq("vendor_id", vendorId)
    .gte("clicked_at", weekStart);

  if (error) return 0;
  return count ?? 0;
}

export async function logWhatsAppClick(vendorId: string): Promise<boolean> {
  const supabase = createServiceRoleClient();

  if (supabase) {
    const { error } = await supabase.from("clicks").insert({ vendor_id: vendorId });
    return !error;
  }

  const client = await createClient();
  const { error } = await client.from("clicks").insert({ vendor_id: vendorId });
  return !error;
}
