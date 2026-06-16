import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BusinessDashboard } from "@/components/dashboard/business-dashboard";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/auth/admin";
import { getWeeklyClickCount } from "@/lib/data/clicks";

export const metadata: Metadata = {
  title: "My Business — RateWala",
  description: "Manage your business profile, cover image, and price list.",
};

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!vendor) {
    if (isAdminEmail(user.email)) {
      redirect("/admin");
    }
    redirect("/add-shop");
  }

  const weeklyClicks = await getWeeklyClickCount(vendor.id);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-8">
      <BusinessDashboard initialWeeklyClicks={weeklyClicks} />
    </div>
  );
}
