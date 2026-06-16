-- RateWala Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vendor type enum
CREATE TYPE vendor_type AS ENUM ('restaurant', 'supplier');

-- Category type enum
CREATE TYPE category_type AS ENUM ('food', 'wholesale');

-- Vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type vendor_type NOT NULL,
  area TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  image_url TEXT DEFAULT '/placeholder.svg',
  rating DECIMAL(2,1) DEFAULT 4.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type category_type NOT NULL,
  icon TEXT
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'piece',
  category TEXT NOT NULL,
  image_url TEXT DEFAULT '/placeholder.svg',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_vendors_type ON vendors(type);
CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_vendors_area ON vendors(area);
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Updated_at trigger for products
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (public read for MVP)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- ============================================
-- SAMPLE DATA: 5 Restaurants + 3 Suppliers
-- ============================================

INSERT INTO categories (name, slug, type, icon) VALUES
  ('Biryani', 'biryani', 'food', 'utensils'),
  ('Karahi', 'karahi', 'food', 'flame'),
  ('Pizza', 'pizza', 'food', 'pizza'),
  ('Oil & Ghee', 'oil-ghee', 'wholesale', 'droplet'),
  ('Chicken', 'chicken', 'wholesale', 'drumstick'),
  ('Rice', 'rice', 'wholesale', 'wheat'),
  ('Daal', 'daal', 'food', 'bowl'),
  ('Packaging', 'packaging', 'wholesale', 'package');

-- Restaurants
INSERT INTO vendors (name, slug, type, area, address, phone, whatsapp, image_url, rating, is_verified, description) VALUES
  ('Shahjahan Restaurant', 'shahjahan-restaurant', 'restaurant', 'Gulgasht', 'Bosan Road, Gulgasht Colony', '03001234567', '03001234567', '/placeholder.svg', 4.5, true, 'Famous for authentic desi biryani since 1985.'),
  ('Bundu Khan BBQ', 'bundu-khan-bbq', 'restaurant', 'Cantt', 'Mall Road, Cantt Area', '03007654321', '03007654321', '/placeholder.svg', 4.3, true, 'Premium BBQ and karahi specialist.'),
  ('Pizza Max', 'pizza-max', 'restaurant', 'Gulgasht', 'Gulgasht Avenue', '03009876543', '03009876543', '/placeholder.svg', 4.1, false, 'Fast food and pizza delivery across the city.'),
  ('Al-Madina Karahi House', 'al-madina-karahi', 'restaurant', 'Old City', 'Near Main Bazaar, Old City', '03005551234', '03005551234', '/placeholder.svg', 4.6, true, 'Traditional desi karahi and handi.'),
  ('Student Biryani', 'student-biryani', 'restaurant', 'Bosan Road', 'Bosan Road, Near University Campus', '03004443322', '03004443322', '/placeholder.svg', 4.0, true, 'Budget-friendly biryani for students.');

-- Suppliers
INSERT INTO vendors (name, slug, type, area, address, phone, whatsapp, image_url, rating, is_verified, description) VALUES
  ('Malik Poultry', 'malik-poultry', 'supplier', 'Wholesale Hub', 'Poultry Market, Wholesale Hub', '03001112233', '03001112233', '/placeholder.svg', 4.7, true, 'Wholesale chicken supplier. Fresh daily stock.'),
  ('Al-Habib Oil Traders', 'al-habib-oil', 'supplier', 'Ghanta Ghar', 'Wholesale Market, Ghanta Ghar', '03002223344', '03002223344', '/placeholder.svg', 4.4, true, 'Cooking oil, ghee, and tin packaging.'),
  ('Rice King Wholesale', 'rice-king-wholesale', 'supplier', 'Grain Market', 'Grain Market, Main Road', '03003334455', '03003334455', '/placeholder.svg', 4.2, false, 'Basmati and sella rice at wholesale rates.');

-- Products for Shahjahan Restaurant
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Chicken Biryani', 350, 'plate', 'biryani', NOW() FROM vendors WHERE slug = 'shahjahan-restaurant';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Mutton Biryani', 550, 'plate', 'biryani', NOW() FROM vendors WHERE slug = 'shahjahan-restaurant';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Beef Karahi', 1200, 'kg', 'karahi', NOW() - INTERVAL '1 day' FROM vendors WHERE slug = 'shahjahan-restaurant';

-- Products for Bundu Khan
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Chicken Tikka', 450, 'plate', 'bbq', NOW() FROM vendors WHERE slug = 'bundu-khan-bbq';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Seekh Kabab', 400, 'dozen', 'bbq', NOW() FROM vendors WHERE slug = 'bundu-khan-bbq';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Mutton Karahi', 2800, 'kg', 'karahi', NOW() - INTERVAL '2 days' FROM vendors WHERE slug = 'bundu-khan-bbq';

-- Products for Pizza Max
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Chicken Fajita Pizza', 899, 'large', 'pizza', NOW() FROM vendors WHERE slug = 'pizza-max';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Cheese Lover Pizza', 799, 'medium', 'pizza', NOW() FROM vendors WHERE slug = 'pizza-max';

-- Products for Al-Madina
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Chicken Karahi', 1400, 'kg', 'karahi', NOW() FROM vendors WHERE slug = 'al-madina-karahi';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Daal Mash', 250, 'plate', 'daal', NOW() FROM vendors WHERE slug = 'al-madina-karahi';

-- Products for Student Biryani
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Student Biryani', 200, 'plate', 'biryani', NOW() FROM vendors WHERE slug = 'student-biryani';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Chicken Pulao', 180, 'plate', 'rice', NOW() FROM vendors WHERE slug = 'student-biryani';

-- Products for Malik Poultry
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Chicken (Live)', 580, 'kg', 'chicken', NOW() FROM vendors WHERE slug = 'malik-poultry';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Chicken (Dressed)', 620, 'kg', 'chicken', NOW() - INTERVAL '1 day' FROM vendors WHERE slug = 'malik-poultry';

-- Products for Al-Habib Oil
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Oil 16kg Tin', 6200, 'tin', 'oil-ghee', NOW() - INTERVAL '1 day' FROM vendors WHERE slug = 'al-habib-oil';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Ghee 5kg Tin', 4500, 'tin', 'oil-ghee', NOW() FROM vendors WHERE slug = 'al-habib-oil';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Oil 1L Pouch', 420, 'pouch', 'oil-ghee', NOW() FROM vendors WHERE slug = 'al-habib-oil';

-- Products for Rice King
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Basmati Rice 25kg', 5500, 'bag', 'rice', NOW() FROM vendors WHERE slug = 'rice-king-wholesale';
INSERT INTO products (vendor_id, name, price, unit, category, updated_at)
SELECT id, 'Sella Rice 50kg', 4800, 'bag', 'rice', NOW() - INTERVAL '2 days' FROM vendors WHERE slug = 'rice-king-wholesale';
