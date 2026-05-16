import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to bag", { position: "top-center" });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.node.handle }}
      className="group block"
    >
      <div className="aspect-[3/4] overflow-hidden bg-secondary rounded-md">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.node.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
        )}
      </div>
      <div className="pt-4 space-y-1">
        <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
          {product.node.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
        <Button
          onClick={handleAdd}
          disabled={isLoading || !variant}
          variant="outline"
          size="sm"
          className="mt-2 w-full border-primary/20 hover:bg-primary hover:text-primary-foreground"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Bag"}
        </Button>
      </div>
    </Link>
  );
}
