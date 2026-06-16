-- Run once in Supabase SQL Editor
-- Copies missing product categories into the categories catalog table

INSERT INTO categories (name, slug, type, icon)
SELECT DISTINCT ON (p.category)
  INITCAP(REPLACE(p.category, '-', ' ')),
  p.category,
  CASE WHEN v.type = 'supplier' THEN 'wholesale'::category_type ELSE 'food'::category_type END,
  CASE WHEN v.type = 'supplier' THEN 'package' ELSE 'utensils' END
FROM products p
JOIN vendors v ON v.id = p.vendor_id
WHERE p.category IS NOT NULL
  AND p.category != 'general'
  AND NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = p.category)
ON CONFLICT (slug) DO NOTHING;
