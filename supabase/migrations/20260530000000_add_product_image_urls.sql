-- Add support for multiple catalog image URLs on products.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_urls JSONB;

COMMENT ON COLUMN public.products.image_urls IS 'A JSON array of image URLs for the product, including uploaded storage assets and external links.';

UPDATE public.products
SET image_urls = jsonb_build_array(image_url)
WHERE image_url IS NOT NULL;
