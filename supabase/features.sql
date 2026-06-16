-- RateWala feature migration: admin approval, WhatsApp clicks, stale reminders
-- Run in Supabase SQL Editor AFTER schema.sql and auth.sql

-- Approval workflow for new vendor listings
DO $$ BEGIN
  CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS approval_status approval_status NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS last_reminder_at TIMESTAMPTZ;

-- Keep existing seed / live listings visible; new signups default to pending
UPDATE vendors SET approval_status = 'approved' WHERE approval_status IS NULL;
ALTER TABLE vendors ALTER COLUMN approval_status SET DEFAULT 'pending';

-- WhatsApp click tracking
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clicks_vendor_id ON clicks(vendor_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);

ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert clicks" ON clicks;
CREATE POLICY "Public insert clicks"
  ON clicks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Owners read own clicks" ON clicks;
CREATE POLICY "Owners read own clicks"
  ON clicks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = clicks.vendor_id
        AND vendors.owner_id = auth.uid()
    )
  );

-- Public only sees approved vendors (owners still see their own pending/rejected listing)
DROP POLICY IF EXISTS "Public read vendors" ON vendors;
CREATE POLICY "Public read vendors"
  ON vendors FOR SELECT
  USING (
    approval_status = 'approved'
    OR owner_id = auth.uid()
  );

DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
        AND (
          vendors.approval_status = 'approved'
          OR vendors.owner_id = auth.uid()
        )
    )
  );
