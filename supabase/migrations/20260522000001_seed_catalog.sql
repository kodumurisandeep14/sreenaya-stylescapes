-- Seed script for Categories and Products

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Men', 'men', 'Men clothing and accessories'),
  ('22222222-2222-2222-2222-222222222222', 'Women', 'women', 'Women clothing and accessories'),
  ('33333333-3333-3333-3333-333333333333', 'Kids', 'kids', 'Kids clothing')
ON CONFLICT (slug) DO NOTHING;

-- Insert Products
INSERT INTO public.products (category_id, name, slug, description, price, image_url, in_stock) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Classic White T-Shirt', 'classic-white-tshirt', 'A classic white cotton t-shirt for men.', 19.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', true),
  ('11111111-1111-1111-1111-111111111111', 'Slim Fit Jeans', 'mens-slim-fit-jeans', 'Dark blue slim fit jeans.', 49.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80', true),
  ('22222222-2222-2222-2222-222222222222', 'Floral Summer Dress', 'floral-summer-dress', 'Light and breezy floral summer dress.', 59.99, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80', true),
  ('22222222-2222-2222-2222-222222222222', 'Leather Handbag', 'womens-leather-handbag', 'Premium brown leather handbag.', 129.99, 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80', true),
  ('33333333-3333-3333-3333-333333333333', 'Kids Denim Jacket', 'kids-denim-jacket', 'Cool denim jacket for kids.', 34.99, 'https://images.unsplash.com/photo-1519238263530-99eaa141f8ae?w=500&q=80', true)
ON CONFLICT (slug) DO NOTHING;
