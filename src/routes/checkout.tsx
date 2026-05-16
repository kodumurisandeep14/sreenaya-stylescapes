import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({
    meta: [
      { title: "Sample Checkout - Sreenaya Stylescapes" },
      { name: "description", content: "Sample checkout page for testing cart flow." },
    ],
  }),
});

function Checkout() {
  const { items, clearCart } = useCartStore();
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto max-w-3xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">Sample Checkout</p>
        <h1 className="mt-3 font-display text-5xl">Review your bag</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Button asChild className="mt-6">
              <Link to="/">Back to shop</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            <div className="divide-y divide-border rounded-lg border border-border bg-card">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 p-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                    {item.product.node.images.edges[0]?.node && (
                      <img
                        src={item.product.node.images.edges[0].node.url}
                        alt={item.product.node.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl">{item.product.node.title}</h2>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {item.price.currencyCode} {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <span className="text-lg">Total</span>
              <span className="font-display text-3xl">USD {totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={clearCart} size="lg">
                Place sample order
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">Continue shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
