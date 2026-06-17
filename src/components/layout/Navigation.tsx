import { CartBadge } from '../cart/CartBadge';
import { CartDrawer } from '../cart/CartDrawer';

export function Navigation() {
  return (
    <>
      <nav className="sticky top-0 z-30 bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-display text-xl text-accent">BrewAI</span>
          <CartBadge />
        </div>
      </nav>
      {/* CartDrawer is always mounted globally here — visibility driven by cartStore.isOpen */}
      <CartDrawer />
    </>
  );
}
