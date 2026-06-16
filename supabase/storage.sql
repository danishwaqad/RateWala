-- Run in Supabase SQL Editor
-- Adds product image column + storage bucket for uploads

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '/placeholder.svg';

-- Storage bucket for vendor + product images (max 5MB, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ratewala-images',
  'ratewala-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public read ratewala images" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload ratewala images" ON storage.objects;
DROP POLICY IF EXISTS "Auth update ratewala images" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete ratewala images" ON storage.objects;

CREATE POLICY "Public read ratewala images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'ratewala-images');

CREATE POLICY "Auth upload ratewala images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'ratewala-images');

CREATE POLICY "Auth update ratewala images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'ratewala-images');

CREATE POLICY "Auth delete ratewala images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'ratewala-images');
