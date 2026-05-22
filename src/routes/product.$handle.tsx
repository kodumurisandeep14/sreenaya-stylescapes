import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => { router.invalidate(); reset(); }}>Try again</Button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl">Product not found</h1>
        <Link to="/" className="mt-4 inline-block text-accent">Back to shop</Link>
      </div>
    </div>
  ),
});

function ProductPage() {
  const { handle } = Route.useParams();
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const { data: product, isLoading: loading } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      return await getProductBySlug(handle);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-4xl">Product not found</h1>
          <Link to="/" className="mt-4 inline-block text-accent">← Back to shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAdd = async () => {
    await addItem({
      product,
      variantId: product.id,
      variantTitle: "Default",
      price: { amount: product.price.toString(), currencyCode: "USD" },
      quantity: 1,
      selectedOptions: [],
    });
    toast.success("Added to bag", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to shop
        </Link>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image available</div>
              )}
            </div>
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-2xl font-display text-primary">
              ${product.price.toFixed(2)}
            </p>
            {product.description && (
              <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
            )}
            
            <Button onClick={handleAdd} disabled={isLoading || !product.in_stock} size="lg" className="mt-10 w-full bg-primary hover:bg-primary/90">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : product.in_stock ? "Add to Bag" : "Sold Out"}
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
