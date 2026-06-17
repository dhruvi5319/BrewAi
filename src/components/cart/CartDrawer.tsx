import { useState, useEffect } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { CartItem } from './CartItem';
import { Button } from '../ui/index';

export function CartDrawer() {
  const { items, subtotal, isOpen, clearCart, closeCart } = useCartStore();
  const [confirmClear, setConfirmClear] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Body scroll lock when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop — desktop only (md+) */}
      <div
        className="hidden md:block fixed inset-0 bg-canvas/50 z-40"
        style={{ pointerEvents: isOpen ? 'auto' : 'none', opacity: isOpen ? 1 : 0 }}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-surface z-50 flex flex-col shadow-2xl transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-xl text-primary">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 text-secondary hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-accent"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-secondary">Your cart is empty</p>
              <Button variant="secondary" onClick={closeCart}>
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <CartItem key={item.cartItemId} item={item} />
              ))}

              {/* Clear Cart */}
              {!confirmClear ? (
                <button
                  onClick={() => setConfirmClear(true)}
                  aria-label="Clear all items from cart"
                  className="mt-4 text-sm text-secondary hover:text-error transition-colors"
                >
                  Clear Cart
                </button>
              ) : (
                <div className="mt-4 p-3 bg-surface-raised rounded-lg border border-border">
                  <p className="text-sm text-primary mb-3">
                    Remove all items from your cart?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        clearCart();
                        setConfirmClear(false);
                      }}
                    >
                      Clear All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmClear(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex justify-between mb-4">
            <span className="text-secondary">Subtotal</span>
            <span className="text-primary font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <Button
            variant="primary"
            disabled={items.length === 0}
            aria-disabled={items.length === 0 ? true : undefined}
            onClick={() => {
              // TODO Phase 4: submit order
            }}
            className="w-full"
          >
            Place Order
          </Button>
        </div>
      </div>
    </>
  );
}
