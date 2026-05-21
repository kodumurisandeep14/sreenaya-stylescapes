import { ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 mt-24">
      <div className="container mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl text-primary">Sreenaya Stylescapes</h3>
          <p className="text-xs uppercase tracking-[0.3em] text-accent mt-1">Boutique</p>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Sarees, dresses, kurtis & co-ords. Stylish, unique and affordable — handpicked for you.
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-foreground">Visit</h4>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            833 Ivy Vine Pl<br />Alpharetta, GA<br />USA Shipping Available
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-foreground">Follow</h4>
          <a
            href="https://www.instagram.com/sreenaya_stylescapes"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            @sreenaya_stylescapes
            <ExternalLink className="h-3 w-3" />
          </a>
          <p className="text-sm text-muted-foreground mt-1">WhatsApp: +1 (304) 435-4235</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © 2026 Sreenaya Stylescapes. Crafted with love.
      </div>
    </footer>
  );
};
