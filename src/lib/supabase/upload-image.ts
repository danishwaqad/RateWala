import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "ratewala-images";

export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  storagePath: string
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${storagePath}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadVendorCover(
  supabase: SupabaseClient,
  vendorId: string,
  file: File
): Promise<string> {
  return uploadImage(supabase, file, `vendors/${vendorId}/cover`);
}

export async function uploadProductImage(
  supabase: SupabaseClient,
  vendorId: string,
  file: File
): Promise<string> {
  return uploadImage(supabase, file, `products/${vendorId}`);
}
