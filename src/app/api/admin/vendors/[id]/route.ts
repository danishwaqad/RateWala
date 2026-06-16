import { NextResponse } from "next/server";
import { assertAdminApi } from "@/lib/api/assert-admin";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { ApprovalStatus, VendorUpdate } from "@/types/database";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function getWeekStart(): string {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start.toISOString();
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = await assertAdminApi();
  if ("error" in auth) return auth.error;

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured." }, { status: 500 });
  }

  const { id } = await context.params;

  const { data: vendor, error: vendorError } = await admin
    .from("vendors")
    .select("*")
    .eq("id", id)
    .single();

  if (vendorError || !vendor) {
    return NextResponse.json({ error: vendorError?.message ?? "Vendor not found." }, { status: 404 });
  }

  const [{ data: products }, { count: weeklyClicks }] = await Promise.all([
    admin.from("products").select("*").eq("vendor_id", id).order("updated_at", { ascending: false }),
    admin
      .from("clicks")
      .select("id", { count: "exact", head: true })
      .eq("vendor_id", id)
      .gte("clicked_at", getWeekStart()),
  ]);

  return NextResponse.json({
    vendor,
    products: products ?? [],
    weeklyClicks: weeklyClicks ?? 0,
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await assertAdminApi();
  if ("error" in auth) return auth.error;

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured." }, { status: 500 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as VendorUpdate & {
    is_verified?: boolean;
    approval_status?: ApprovalStatus;
  };

  const patch: VendorUpdate = {};

  const stringFields = ["name", "slug", "area", "address", "phone", "whatsapp", "image_url", "description"] as const;
  for (const field of stringFields) {
    if (body[field] !== undefined) {
      patch[field] = body[field] as string;
    }
  }

  if (body.type === "restaurant" || body.type === "supplier") {
    patch.type = body.type;
  }

  if (typeof body.is_verified === "boolean") {
    patch.is_verified = body.is_verified;
  }

  if (body.approval_status && ["pending", "approved", "rejected"].includes(body.approval_status)) {
    patch.approval_status = body.approval_status;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const { data, error } = await admin.from("vendors").update(patch).eq("id", id).select().single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Update failed." }, { status: 500 });
  }

  return NextResponse.json({ vendor: data });
}
