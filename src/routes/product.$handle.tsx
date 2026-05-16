import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { SAMPLE_PRODUCT_HANDLE, sampleProduct } from "@/lib/sampleProduct";
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
  const [variantIdx, setVariantIdx] = useState(0);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      if (handle === SAMPLE_PRODUCT_HANDLE) return sampleProduct.node;
      const res = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      return res?.data?.productByHandle;
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

  if (!data) {
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

  const variant = data.variants.edges[variantIdx]?.node;
  const images = data.images.edges;
  const productNode = { node: data };

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product: productNode,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
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
              {images[0] && <img src={images[0].node.url} alt={data.title} className="w-full h-full object-cover" />}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((img: { node: { url: string; altText: string | null } }, i: number) => (
                  <div key={i} className="aspect-square bg-secondary rounded overflow-hidden">
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-5xl">{data.title}</h1>
            <p className="mt-4 text-2xl font-display text-primary">
              {variant?.price.currencyCode} {parseFloat(variant?.price.amount ?? "0").toFixed(2)}
            </p>
            {data.description && (
              <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">{data.description}</p>
            )}
            {data.variants.edges.length > 1 && (
              <div className="mt-8">
                <p className="text-sm uppercase tracking-widest text-foreground mb-3">Options</p>
                <div className="flex flex-wrap gap-2">
                  {data.variants.edges.map((v: { node: { id: string; title: string } }, i: number) => (
                    <button
                      key={v.node.id}
                      onClick={() => setVariantIdx(i)}
                      className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                        variantIdx === i ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                      }`}
                    >
                      {v.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={handleAdd} disabled={isLoading || !variant?.availableForSale} size="lg" className="mt-10 w-full bg-primary hover:bg-primary/90">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : variant?.availableForSale ? "Add to Bag" : "Sold Out"}
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
