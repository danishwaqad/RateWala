import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { daysSinceLastUpdate, isRatesStale } from "@/lib/data/freshness";
import { sendStaleReminderEmail } from "@/lib/email/send-reminder";
import { getWhatsAppUrl } from "@/lib/utils";
import type { Product } from "@/types/database";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, name, whatsapp, phone, last_reminder_at")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!vendor) {
    return NextResponse.json({ error: "No business found." }, { status: 404 });
  }

  const { data: products } = await supabase
    .from("products")
    .select("updated_at")
    .eq("vendor_id", vendor.id);

  const productRows = (products ?? []) as Pick<Product, "updated_at">[];

  if (!isRatesStale(productRows)) {
    return NextResponse.json({ error: "Rates are up to date." }, { status: 400 });
  }

  const daysSince = daysSinceLastUpdate(productRows);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ratewala.vercel.app";
  const dashboardUrl = `${siteUrl}/dashboard`;

  const emailSent = user.email
    ? await sendStaleReminderEmail({
        to: user.email,
        vendorName: vendor.name,
        daysSinceUpdate: daysSince,
        dashboardUrl,
      })
    : false;

  const whatsappReminderUrl = getWhatsAppUrl(
    vendor.whatsapp || vendor.phone,
    `RateWala reminder: Please update your price list for ${vendor.name}. Last update was ${daysSince} days ago.`
  );

  const admin = createServiceRoleClient();
  if (admin) {
    await admin
      .from("vendors")
      .update({ last_reminder_at: new Date().toISOString() })
      .eq("id", vendor.id);
  }

  return NextResponse.json({
    ok: true,
    emailSent,
    whatsappReminderUrl,
    daysSinceUpdate: daysSince,
  });
}
