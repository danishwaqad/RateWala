-- Run this in Supabase SQL Editor AFTER schema.sql
-- Links vendors to logged-in users + allows shop registration

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vendors_owner_id ON vendors(owner_id);

-- Authenticated users can register their own shop
DROP POLICY IF EXISTS "Authenticated insert vendors" ON vendors;
CREATE POLICY "Authenticated insert vendors"
  ON vendors FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Owners can update their own shop
DROP POLICY IF EXISTS "Owners update vendors" ON vendors;
CREATE POLICY "Owners update vendors"
  ON vendors FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Owners can add products to their shop
DROP POLICY IF EXISTS "Owners insert products" ON products;
CREATE POLICY "Owners insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
        AND vendors.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners update products" ON products;
CREATE POLICY "Owners update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
        AND vendors.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
        AND vendors.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners delete products" ON products;
CREATE POLICY "Owners delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = products.vendor_id
        AND vendors.owner_id = auth.uid()
    )
  );

-- Logged-in users can add new categories when listing products
DROP POLICY IF EXISTS "Authenticated insert categories" ON categories;
CREATE POLICY "Authenticated insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- One business per user (optional constraint)
CREATE UNIQUE INDEX IF NOT EXISTS idx_vendors_one_per_owner
  ON vendors(owner_id)
  WHERE owner_id IS NOT NULL;
