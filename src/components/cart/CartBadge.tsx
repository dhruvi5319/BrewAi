import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';

export function CartBadge() {
  const { totalCount, openCart } = useCartStore();

  return (
    <button
      onClick={openCart}
      aria-label={totalCount > 0 ? `Open cart, ${totalCount} items` : 'Open cart'}
      className="relative p-2 text-primary hover:text-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
    >
      <ShoppingCart size={22} />
      {totalCount > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-accent text-canvas text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none"
          aria-hidden="true"
        >
          {totalCount}
        </span>
      )}
    </button>
  );
}
