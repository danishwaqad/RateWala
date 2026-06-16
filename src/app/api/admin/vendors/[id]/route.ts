import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ApprovalStatus, VendorUpdate } from "@/types/database";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured." },
      { status: 500 }
    );
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    is_verified?: boolean;
    approval_status?: ApprovalStatus;
  };

  const patch: VendorUpdate = {};

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
