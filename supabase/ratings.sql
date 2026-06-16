-- Run in Supabase SQL Editor AFTER schema.sql and auth.sql
-- Ratings + comments from logged-in users (one review per user per business)

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS review_count INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS vendor_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL CHECK (char_length(trim(comment)) >= 5),
  author_name TEXT NOT NULL DEFAULT 'User',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (vendor_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_vendor_reviews_vendor_id ON vendor_reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_user_id ON vendor_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_created_at ON vendor_reviews(created_at DESC);

CREATE OR REPLACE FUNCTION update_vendor_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vendor_reviews_updated_at ON vendor_reviews;
CREATE TRIGGER vendor_reviews_updated_at
  BEFORE UPDATE ON vendor_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_reviews_updated_at();

CREATE OR REPLACE FUNCTION refresh_vendor_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
  target_vendor_id UUID;
  avg_rating DECIMAL(2,1);
  total_reviews INTEGER;
BEGIN
  target_vendor_id := COALESCE(NEW.vendor_id, OLD.vendor_id);

  SELECT
    ROUND(AVG(rating)::numeric, 1),
    COUNT(*)::INTEGER
  INTO avg_rating, total_reviews
  FROM vendor_reviews
  WHERE vendor_id = target_vendor_id;

  IF total_reviews = 0 THEN
    UPDATE vendors
    SET review_count = 0
    WHERE id = target_vendor_id;
  ELSE
    UPDATE vendors
    SET
      rating = avg_rating,
      review_count = total_reviews
    WHERE id = target_vendor_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vendor_reviews_stats_trigger ON vendor_reviews;
CREATE TRIGGER vendor_reviews_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON vendor_reviews
  FOR EACH ROW
  EXECUTE FUNCTION refresh_vendor_rating_stats();

ALTER TABLE vendor_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read vendor reviews" ON vendor_reviews;
DROP POLICY IF EXISTS "Users insert own reviews" ON vendor_reviews;
DROP POLICY IF EXISTS "Users update own reviews" ON vendor_reviews;
DROP POLICY IF EXISTS "Users delete own reviews" ON vendor_reviews;

CREATE POLICY "Public read vendor reviews"
  ON vendor_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users insert own reviews"
  ON vendor_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_reviews.vendor_id
        AND vendors.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users update own reviews"
  ON vendor_reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = vendor_reviews.vendor_id
        AND vendors.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users delete own reviews"
  ON vendor_reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
