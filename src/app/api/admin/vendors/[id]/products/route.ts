import { NextResponse } from "next/server";
import { assertAdminApi } from "@/lib/api/assert-admin";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { ensureCategoryInCatalog } from "@/lib/data/categories";
import { slugify } from "@/lib/utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await assertAdminApi();
  if ("error" in auth) return auth.error;

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured." }, { status: 500 });
  }

  const { id: vendorId } = await context.params;
  const body = (await request.json()) as {
    name?: string;
    price?: number;
    unit?: string;
    category?: string;
    image_url?: string;
  };

  if (!body.name?.trim() || body.price == null || !body.unit?.trim()) {
    return NextResponse.json({ error: "Name, price, and unit are required." }, { status: 400 });
  }

  const { data: vendor, error: vendorError } = await admin
    .from("vendors")
    .select("type")
    .eq("id", vendorId)
    .single();

  if (vendorError || !vendor) {
    return NextResponse.json({ error: "Vendor not found." }, { status: 404 });
  }

  const category =
    slugify(body.category ?? "") || body.category?.trim().toLowerCase() || "general";
  const categoryType = vendor.type === "supplier" ? "wholesale" : "food";
  const catalogResult = await ensureCategoryInCatalog(admin, category, categoryType);

  if (!catalogResult.ok) {
    return NextResponse.json({ error: catalogResult.error ?? "Could not save category." }, { status: 500 });
  }

  const { data: product, error } = await admin
    .from("products")
    .insert({
      vendor_id: vendorId,
      name: body.name.trim(),
      price: body.price,
      unit: body.unit.trim(),
      category,
      image_url: body.image_url?.trim() || "/placeholder.svg",
    })
    .select()
    .single();

  if (error || !product) {
    return NextResponse.json({ error: error?.message ?? "Could not add product." }, { status: 500 });
  }

  return NextResponse.json({ product });
}
