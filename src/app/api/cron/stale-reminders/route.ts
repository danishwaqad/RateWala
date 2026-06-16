import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { daysSinceLastUpdate, isRatesStale, STALE_RATE_DAYS } from "@/lib/data/freshness";
import { sendStaleReminderEmail } from "@/lib/email/send-reminder";
import { getWhatsAppUrl } from "@/lib/utils";
import type { Product } from "@/types/database";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: "Service role not configured." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ratewala.vercel.app";
  const { data: vendors, error } = await admin.from("vendors").select("id, name, whatsapp, phone, owner_id, last_reminder_at");

  if (error || !vendors) {
    return NextResponse.json({ error: error?.message ?? "Failed to load vendors." }, { status: 500 });
  }

  let remindersSent = 0;

  for (const vendor of vendors) {
    if (!vendor.owner_id) continue;

    const reminderCooldownMs = STALE_RATE_DAYS * 24 * 60 * 60 * 1000;
    if (
      vendor.last_reminder_at &&
      Date.now() - new Date(vendor.last_reminder_at).getTime() < reminderCooldownMs
    ) {
      continue;
    }

    const { data: products } = await admin
      .from("products")
      .select("updated_at")
      .eq("vendor_id", vendor.id);

    const productRows = (products ?? []) as Pick<Product, "updated_at">[];
    if (!isRatesStale(productRows)) continue;

    const { data: ownerData } = await admin.auth.admin.getUserById(vendor.owner_id);
    const ownerEmail = ownerData.user?.email;
    const daysSince = daysSinceLastUpdate(productRows);

    if (ownerEmail) {
      const sent = await sendStaleReminderEmail({
        to: ownerEmail,
        vendorName: vendor.name,
        daysSinceUpdate: daysSince,
        dashboardUrl: `${siteUrl}/dashboard`,
      });

      if (sent) {
        remindersSent += 1;
      }
    }

    // WhatsApp reminder link is logged for ops; auto-send needs WhatsApp Business API
    const whatsappUrl = getWhatsAppUrl(
      vendor.whatsapp || vendor.phone,
      `RateWala: ${vendor.name} ki rates ${daysSince} din se update nahi hui. Dashboard: ${siteUrl}/dashboard`
    );

    await admin
      .from("vendors")
      .update({ last_reminder_at: new Date().toISOString() })
      .eq("id", vendor.id);

    console.info(`Stale reminder prepared for ${vendor.name}: ${whatsappUrl}`);
  }

  return NextResponse.json({ ok: true, remindersSent });
}
