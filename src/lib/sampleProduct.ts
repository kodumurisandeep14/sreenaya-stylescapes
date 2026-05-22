import heroImage from "@/assets/hero.jpg";
import type { Product } from "@/lib/types";

export const SAMPLE_PRODUCT_HANDLE = "sample-silk-kurti";
export const SAMPLE_VARIANT_ID = "sample-variant-silk-kurti";

export const sampleProduct: Product = {
  id: "sample-product-silk-kurti",
  category_id: null,
  name: "Sample Silk Kurti",
  description:
    "A simple sample product for testing the cart and checkout flow. Replace this with a real product when your catalog is ready.",
  slug: SAMPLE_PRODUCT_HANDLE,
  price: 49.00,
  image_url: heroImage,
  in_stock: true,
  created_at: new Date().toISOString(),
};

export function isSampleVariantId(variantId: string) {
  return variantId.startsWith("sample-");
}
