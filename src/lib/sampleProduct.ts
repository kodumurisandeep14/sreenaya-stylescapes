import heroImage from "@/assets/hero.jpg";
import type { ShopifyProduct } from "@/lib/shopify";

export const SAMPLE_PRODUCT_HANDLE = "sample-silk-kurti";
export const SAMPLE_VARIANT_ID = "sample-variant-silk-kurti";

export const sampleProduct: ShopifyProduct = {
  node: {
    id: "sample-product-silk-kurti",
    title: "Sample Silk Kurti",
    description:
      "A simple sample product for testing the cart and checkout flow. Replace this with a real Shopify product when your catalog is ready.",
    handle: SAMPLE_PRODUCT_HANDLE,
    priceRange: {
      minVariantPrice: { amount: "49.00", currencyCode: "USD" },
    },
    images: {
      edges: [
        {
          node: {
            url: heroImage,
            altText: "Sample silk kurti",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: SAMPLE_VARIANT_ID,
            title: "Default",
            price: { amount: "49.00", currencyCode: "USD" },
            availableForSale: true,
            selectedOptions: [{ name: "Style", value: "Sample" }],
          },
        },
      ],
    },
    options: [{ name: "Style", values: ["Sample"] }],
  },
};

export function isSampleVariantId(variantId: string) {
  return variantId.startsWith("sample-");
}
