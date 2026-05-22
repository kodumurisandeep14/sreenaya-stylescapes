import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/lib/types";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addItem({
      product,
      variantId: product.id, // using product.id as variantId since we don't have variants yet
      variantTitle: "Default",
      price: { amount: product.price.toString(), currencyCode: "USD" },
      quantity: 1,
      selectedOptions: [],
    });
    toast.success("Added to bag", { position: "top-center" });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.slug }}
      className="group block"
    >
      <div className="aspect-[3/4] overflow-hidden bg-secondary rounded-md">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
        )}
      </div>
      <div className="pt-4 space-y-1">
        <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          ${product.price.toFixed(2)}
        </p>
        <Button
          onClick={handleAdd}
          disabled={isLoading || !product.in_stock}
          variant="outline"
          size="sm"
          className="mt-2 w-full border-primary/20 hover:bg-primary hover:text-primary-foreground"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : product.in_stock ? "Add to Bag" : "Out of Stock"}
        </Button>
      </div>
    </Link>
  );
}
