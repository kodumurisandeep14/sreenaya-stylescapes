import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/catalog";
import { sampleProduct } from "@/lib/sampleProduct";
import heroImage from "@/assets/hero.jpg";
import { Loader2, MapPin, Sparkles, Truck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sreenaya Stylescapes — Sarees, Dresses, Kurtis | Alpharetta, GA" },
      { name: "description", content: "Shop sarees, dresses, kurtis, co-ords and kids wear. Stylish, unique, affordable. Boutique in Alpharetta, GA. USA shipping available." },
    ],
  }),
});

function Index() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const products = await getProducts(24);
        return products;
      } catch {
        return [];
      }
    },
  });

  const products = [sampleProduct, ...(data ?? [])];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
        <img src={heroImage} alt="Sreenaya Stylescapes boutique" width={1600} height={1100} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative z-10 container mx-auto h-full flex flex-col justify-end px-6 pb-16 text-primary-foreground">
          <p className="text-xs uppercase tracking-[0.4em] text-accent mb-4">Clothing • Boutique • Alpharetta</p>
          <h1 className="font-display text-5xl md:text-7xl max-w-3xl leading-[1.05]">
            Sarees, dresses & kurtis<br />handpicked with love.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-primary-foreground/85">
            Stylish, unique and affordable ethnic wear for women and kids. Shipping across the USA.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <a href="#collection">Shop Collection</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/70 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm">
              <Link to="/contact">Visit Boutique</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-6 py-16 grid gap-10 md:grid-cols-3">
        {[
          { icon: Sparkles, title: "Handpicked Pieces", text: "Every saree and kurti is curated for craftsmanship and quality." },
          { icon: Truck, title: "USA Shipping", text: "Order from anywhere in the United States — we ship to your doorstep." },
          { icon: MapPin, title: "Alpharetta, GA", text: "Visit our boutique for in-person styling and exclusive in-store pieces." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="text-center md:text-left">
            <Icon className="h-7 w-7 text-accent mx-auto md:mx-0" />
            <h3 className="mt-4 font-display text-xl">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </section>

      {/* Collection */}
      <section id="collection" className="container mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">The Collection</p>
            <h2 className="font-display text-4xl md:text-5xl mt-2">New Arrivals</h2>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
