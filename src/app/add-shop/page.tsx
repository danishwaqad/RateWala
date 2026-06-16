import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AddShopForm } from "@/components/auth/add-shop-form";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/auth/admin";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "List Your Business — RateWala",
  description: "Add your restaurant or wholesale business to RateWala.",
};

export default async function AddShopPage() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect("/login?next=/add-shop");
      }

      if (isAdminEmail(user.email)) {
        redirect("/admin");
      }

      const { data: existing } = await supabase
        .from("vendors")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (existing) {
        redirect("/dashboard");
      }
    } catch {
      // Allow form to render; client will handle errors
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("addShopPageTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("addShopPageSubtitle")}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <AddShopForm />
      </div>
    </div>
  );
}
