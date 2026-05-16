import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, MessageCircle, Instagram } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Visit & Contact — Sreenaya Stylescapes" },
      { name: "description", content: "Visit Sreenaya Stylescapes boutique at 833 Ivy Vine Pl, Alpharetta, GA. WhatsApp orders welcome." },
    ],
  }),
});

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-6 py-24 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">Visit Us</p>
        <h1 className="font-display text-5xl md:text-6xl mt-3">Come say hello.</h1>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl">Boutique</h3>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  833 Ivy Vine Pl<br />Alpharetta, GA<br />USA
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <MessageCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl">WhatsApp</h3>
                <p className="mt-1 text-muted-foreground">Reach out for orders, custom requests and styling.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Instagram className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-xl">Instagram</h3>
                <p className="mt-1 text-muted-foreground">@sreenaya_stylescapes — see our latest pieces & pop-ups.</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-border" style={{ boxShadow: "var(--shadow-soft)" }}>
            <iframe
              title="Sreenaya Stylescapes location"
              src="https://www.google.com/maps?q=833+Ivy+Vine+Pl,+Alpharetta,+GA&output=embed"
              className="w-full h-80 border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
