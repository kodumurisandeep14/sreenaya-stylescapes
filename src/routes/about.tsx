import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Sreenaya Stylescapes" },
      { name: "description", content: "About Sreenaya Stylescapes boutique in Alpharetta, GA — stylish, unique and affordable Indian ethnic wear." },
    ],
  }),
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-6 py-24 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">Our Story</p>
        <h1 className="font-display text-5xl md:text-6xl mt-3">About Sreenaya Stylescapes</h1>
        <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            Sreenaya Stylescapes is a boutique born from a love for color, craft and the timeless elegance of Indian textiles.
            From everyday kurtis to statement sarees and joyful kids wear, every piece in our collection is selected for its
            quality, character and wearability.
          </p>
          <p>
            Based in Alpharetta, Georgia, we welcome you to visit our boutique for personal styling, fittings and curated drops.
            Can't make it in person? We ship across the USA — bringing handpicked styles right to your doorstep.
          </p>
          <p className="text-foreground font-display text-2xl pt-4">
            Stylish · Unique · Affordable.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
