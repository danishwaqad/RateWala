import { NextResponse } from "next/server";
import { logWhatsAppClick } from "@/lib/data/clicks";

export async function POST(request: Request) {
  const body = (await request.json()) as { vendor_id?: string };

  if (!body.vendor_id) {
    return NextResponse.json({ error: "vendor_id is required." }, { status: 400 });
  }

  const ok = await logWhatsAppClick(body.vendor_id);

  if (!ok) {
    return NextResponse.json({ error: "Could not log click." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
