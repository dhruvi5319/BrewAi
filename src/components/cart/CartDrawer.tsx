import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { CartItem } from './CartItem';
import { Button, Spinner } from '../ui/index';
import { api } from '../../lib/api';
import type { OrderPayload, OrderLineItem } from '../../types/index';

export function CartDrawer() {
  const { items, subtotal, isOpen, clearCart, closeCart } = useCartStore();
  const [confirmClear, setConfirmClear] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handlePlaceOrder = async () => {
    if (items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    setOrderError(null);

    // Build OrderPayload from cartStore.items
    const payload: OrderPayload = {
      items: items.map((item): OrderLineItem => ({
        menuItemId: item.menuItemId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        customizations: {
          size: item.customizations.size,
          milk: item.customizations.milk,
          temperature: item.customizations.temperature,
          shots: item.customizations.shots,
          addons: item.customizations.addons,
          specialInstructions: item.customizations.specialInstructions,
        },
      })),
      subtotal,
      notes: '',  // Always "" in v1 per FRD and constraints
    };

    try {
      const response = await api.createOrder(payload);
      if (response.error || !response.data) {
        // Server returned an error response
        const code = response.error?.code;
        if (code === 'EMPTY_ORDER') {
          setOrderError('Your cart is empty.');
        } else if (code === 'INVALID_PAYLOAD') {
          setOrderError('Invalid order data. Please refresh and try again.');
        } else {
          setOrderError('Something went wrong placing your order. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }
      // SUCCESS: only now clear cart and navigate
      clearCart();
      closeCart();
      navigate('/confirmation', { state: { order: response.data } });
    } catch {
      // Network failure — no response at all
      setOrderError('Could not reach the server. Check your connection and try again.');
      setIsSubmitting(false);
    }
    // Note: do NOT setIsSubmitting(false) on success — component unmounts on navigation
  };

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
          <button
            onClick={handlePlaceOrder}
            disabled={items.length === 0 || isSubmitting}
            aria-busy={isSubmitting}
            aria-disabled={items.length === 0}
            className={`w-full flex items-center justify-center gap-2 rounded-card px-4 py-3 font-semibold text-canvas transition-all
              bg-accent hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent
              disabled:opacity-75 disabled:cursor-not-allowed min-h-[44px]`}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                <span>Placing order…</span>
              </>
            ) : (
              'Place Order'
            )}
          </button>
          {orderError && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-error">{orderError}</p>
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="text-sm underline text-accent hover:text-accent-hover focus-visible:ring-2 focus-visible:ring-accent"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
