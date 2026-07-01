import { CartBadge } from '../cart/CartBadge';
import { CartDrawer } from '../cart/CartDrawer';

export function Navigation() {
  return (
    <>
      {/* ── Compact header — visible below md, hidden at md+ ── */}
      <header className="flex md:hidden fixed top-0 left-0 right-0 z-40 items-center justify-between px-4 h-14 bg-surface border-b border-border">
        <span className="font-display font-bold text-accent text-lg max-w-[120px] truncate">BrewAI</span>
        <CartBadge />
      </header>

      {/* ── Desktop top bar — hidden below md, visible at md+ ── */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 items-center justify-between px-6 h-16 bg-surface border-b border-border">
        <span className="font-display font-bold text-accent text-xl">BrewAI</span>
        <nav className="flex items-center gap-6">
          <a
            href="/"
            className="text-secondary hover:text-primary text-sm font-body transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-sm min-h-[44px] inline-flex items-center"
          >
            Menu
          </a>
        </nav>
        <CartBadge />
      </header>

      {/* CartDrawer is always mounted globally — visibility driven by cartStore.isOpen */}
      <CartDrawer />
    </>
  );
}
