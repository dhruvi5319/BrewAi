import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  drawerVariantsRight,
  drawerVariantsBottom,
  backdropVariants,
  cartItemExitVariants,
  useReducedMotion,
} from '../../lib/motion';
import { useCartStore } from '../../stores/cartStore';
import { CartItem } from './CartItem';
import { Button, Spinner } from '../ui/index';
import { api } from '../../lib/api';
import type { OrderPayload, OrderLineItem, CartItem as CartItemType } from '../../types/index';

// ─── CartBodyContent ─────────────────────────────────────────

interface CartBodyContentProps {
  items: CartItemType[];
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  shouldReduceMotion: boolean | null;
}

function CartBodyContent({
  items,
  clearCart,
  shouldReduceMotion,
}: CartBodyContentProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
        <p className="text-secondary">Your cart is empty</p>
        <Button variant="secondary" onClick={() => window.location.assign('/')}>
          Browse Menu
        </Button>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.cartItemId}
            variants={shouldReduceMotion ? {} : cartItemExitVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <CartItem item={item} />
          </motion.div>
        ))}
      </AnimatePresence>

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
          <p className="text-sm text-primary mb-3">Remove all items from your cart?</p>
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
            <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── CartFooter ───────────────────────────────────────────────

interface CartFooterProps {
  subtotal: number;
  items: CartItemType[];
  closeCart: () => void;
}

function CartFooter({ subtotal, items, closeCart }: CartFooterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);

  const handlePlaceOrder = async () => {
    if (items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    setOrderError(null);

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
      notes: '',
    };

    try {
      const response = await api.createOrder(payload);
      if (response.error || !response.data) {
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
      clearCart();
      closeCart();
      navigate('/confirmation', { state: { order: response.data } });
    } catch {
      setOrderError('Could not reach the server. Check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}

// ─── CartDrawer ───────────────────────────────────────────────

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, removeItem, updateQuantity, clearCart } =
    useCartStore();
  const shouldReduceMotion = useReducedMotion();

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

  const mobileVariants = shouldReduceMotion ? {} : drawerVariantsBottom;
  const desktopVariants = shouldReduceMotion ? {} : drawerVariantsRight;
  const bkdropVariants = shouldReduceMotion ? {} : backdropVariants;

  const sharedBodyProps = {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    shouldReduceMotion,
  };

  return (
    <>
      {/* ── Mobile drawer (hidden at md+) ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-canvas/80 z-50"
              variants={bkdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeCart}
              aria-hidden="true"
            />
            {/* Drawer panel — full-screen on mobile */}
            <motion.div
              className="fixed inset-0 z-50 bg-surface flex flex-col"
              variants={mobileVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Your cart"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <h2 className="font-display text-xl text-primary">Your Cart</h2>
                <button
                  onClick={closeCart}
                  aria-label="Close cart"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded"
                >
                  ✕
                </button>
              </div>
              {/* Body */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <CartBodyContent {...sharedBodyProps} />
              </div>
              {/* Footer */}
              <CartFooter subtotal={subtotal} items={items} closeCart={closeCart} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Desktop drawer (hidden below md) ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="hidden md:block">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-canvas/50 z-50"
              variants={bkdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeCart}
              aria-hidden="true"
            />
            {/* Drawer panel — 400px slide-over on desktop */}
            <motion.div
              className="fixed right-0 top-0 h-full w-[400px] z-50 bg-surface flex flex-col border-l border-border shadow-2xl"
              variants={desktopVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Your cart"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <h2 className="font-display text-xl text-primary">Your Cart</h2>
                <button
                  onClick={closeCart}
                  aria-label="Close cart"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded"
                >
                  ✕
                </button>
              </div>
              {/* Body */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <CartBodyContent {...sharedBodyProps} />
              </div>
              {/* Footer */}
              <CartFooter subtotal={subtotal} items={items} closeCart={closeCart} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
