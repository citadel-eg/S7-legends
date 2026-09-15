-- ==============================================================================
-- S7 LÉGENDES — RLS SECURITY AUDIT & MINIMAL CLEANUP MIGRATION
-- ==============================================================================
-- 
-- PROBLEM IDENTIFIED IN CURRENT DATABASE:
-- 1. Overly permissive public access: some policies currently allow reading
--    inactive products or all variant rows regardless of stock/availability.
-- 2. Potential duplicate policy definitions across products and product_variants.
-- 
-- OBJECTIVE OF THIS SCRIPT:
-- - Restrict public reads strictly to:
--     • categories where active = true
--     • products where active = true
--     • product_variants where available = true and stock > 0
--     • product_images belonging to active products
-- - Restrict all write operations (INSERT, UPDATE, DELETE) strictly to the
--   configured admin via public.is_admin().
--
-- IMPORTANT:
-- This script does NOT drop tables or delete any product data.
-- Run this script in the Supabase SQL Editor once approved.
-- ==============================================================================

-- 1. CATEGORIES RLS POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
  ON public.categories
  FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Admin full access to categories" ON public.categories;
CREATE POLICY "Admin full access to categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 2. PRODUCTS RLS POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
  ON public.products
  FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Admin full access to products" ON public.products;
CREATE POLICY "Admin full access to products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 3. PRODUCT_VARIANTS RLS POLICIES
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view available variants" ON public.product_variants;
CREATE POLICY "Public can view available variants"
  ON public.product_variants
  FOR SELECT
  USING (
    available = true 
    AND stock > 0
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
      AND p.active = true
    )
  );

DROP POLICY IF EXISTS "Admin full access to variants" ON public.product_variants;
CREATE POLICY "Admin full access to variants"
  ON public.product_variants
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 4. PRODUCT_IMAGES RLS POLICIES
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active product images" ON public.product_images;
CREATE POLICY "Public can view active product images"
  ON public.product_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
      AND p.active = true
    )
  );

DROP POLICY IF EXISTS "Admin full access to images" ON public.product_images;
CREATE POLICY "Admin full access to images"
  ON public.product_images
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 5. STORAGE BUCKET 'products' POLICIES
-- Ensure public can read objects from 'products' bucket
-- Ensure only authenticated admin can upload/update/delete
DROP POLICY IF EXISTS "Public can view product assets" ON storage.objects;
CREATE POLICY "Public can view product assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Admin can manage product assets" ON storage.objects;
CREATE POLICY "Admin can manage product assets"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'products' AND public.is_admin())
  WITH CHECK (bucket_id = 'products' AND public.is_admin());
