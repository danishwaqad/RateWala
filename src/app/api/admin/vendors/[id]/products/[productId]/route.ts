import { NextResponse } from "next/server";
import { assertAdminApi } from "@/lib/api/assert-admin";
import { createServiceRoleClient } from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{ id: string; productId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await assertAdminApi();
  if ("error" in auth) return auth.error;

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured." }, { status: 500 });
  }

  const { id: vendorId, productId } = await context.params;

  const { data, error } = await admin
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("vendor_id", vendorId)
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data?.length) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
