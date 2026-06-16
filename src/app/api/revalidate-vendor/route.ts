import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const slug = body.slug as string | undefined;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id")
    .eq("slug", slug)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!vendor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  revalidatePath(`/vendor/${slug}`);
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/mandi");

  return NextResponse.json({ ok: true });
}
