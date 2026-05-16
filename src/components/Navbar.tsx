import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-display text-2xl font-semibold tracking-wide text-primary">Sreenaya</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent">Stylescapes</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Shop</Link>
          <Link to="/about" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>About</Link>
          <Link to="/contact" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Visit</Link>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
};
