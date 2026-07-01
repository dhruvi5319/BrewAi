import { useState, useEffect, useId, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '../ui/index';
import { modalVariants, drawerVariantsBottom, backdropVariants, useReducedMotion } from '../../lib/motion';
import { useCartStore } from '../../stores/cartStore';
import type { MenuItem, CartItem } from '../../types/index';

// ─── Focus trap helper ────────────────────────────────────────

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

// ─── ModalContent ─────────────────────────────────────────────

interface ModalContentProps {
  item: MenuItem;
  onClose: () => void;
  titleId: string;
  modalRef?: React.Ref<HTMLDivElement>;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

function ModalContent({ item, onClose, titleId, modalRef, onKeyDown }: ModalContentProps) {
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    const med = item.options.sizes.find((s) => s.label === 'Medium');
    return med ? 'Medium' : (item.options.sizes[0]?.label ?? '');
  });
  const [selectedMilk, setSelectedMilk] = useState<string>(item.options.milks[0] ?? '');
  const [selectedTemp, setSelectedTemp] = useState<string>(item.options.temperatures[0] ?? '');
  const [selectedShots, setSelectedShots] = useState<string>('Double');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const addItem = useCartStore((state) => state.addItem);

  // Real-time price calculation
  const sizeOption = item.options.sizes.find((s) => s.label === selectedSize);
  const sizeDelta = sizeOption?.delta ?? 0;
  const addonTotal = selectedAddons.reduce((sum, label) => {
    const extra = item.options.extras.find((e) => e.label === label);
    return sum + (extra?.price ?? 0);
  }, 0);
  const perItemPrice = item.basePrice + sizeDelta + addonTotal;
  const totalPrice = perItemPrice * quantity;

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      cartItemId: crypto.randomUUID(),
      menuItemId: item.id,
      name: item.name,
      unitPrice: perItemPrice,
      quantity,
      customizations: {
        size: selectedSize,
        milk: item.options.milks.length > 0 ? selectedMilk : null,
        temperature: item.options.temperatures.length > 0 ? selectedTemp : null,
        shots: item.options.shots !== null ? selectedShots : null,
        addons: selectedAddons,
        specialInstructions,
      },
    };
    addItem(cartItem);
    toast.success(`${item.name} added to cart`);
    onClose();
  };

  const toggleAddon = (label: string) => {
    setSelectedAddons((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  };

  return (
    <div ref={modalRef} onKeyDown={onKeyDown}>
      {/* Modal header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 id={titleId} className="font-display text-xl font-semibold text-primary">
          {item.name}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className={[
            'flex items-center justify-center h-8 w-8 rounded-input text-secondary',
            'hover:text-primary hover:bg-surface transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised',
          ].join(' ')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Modal body */}
      <div className="p-6 space-y-6">

        {/* 1. Size selector — always shown if sizes.length > 0 */}
        {item.options.sizes.length > 0 && (
          <fieldset className="border-none p-0 m-0">
            <legend className="text-secondary text-sm font-body mb-2 font-medium">Size</legend>
            <div className="flex flex-wrap gap-2">
              {item.options.sizes.map((size) => {
                const isSelected = selectedSize === size.label;
                const deltaText =
                  size.delta > 0
                    ? `+$${size.delta.toFixed(2)}`
                    : size.delta < 0
                    ? `-$${Math.abs(size.delta).toFixed(2)}`
                    : '$0.00';
                return (
                  <label
                    key={size.label}
                    className={[
                      'flex items-center gap-2 px-3 py-2 rounded-input border cursor-pointer',
                      'min-h-[44px] transition-colors duration-150',
                      isSelected
                        ? 'border-accent shadow-[0_0_0_1px_theme(colors.accent)]'
                        : 'border-border hover:border-accent/50',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={size.label}
                      checked={isSelected}
                      onChange={() => setSelectedSize(size.label)}
                      className="sr-only"
                    />
                    <span className="font-body text-sm text-primary font-medium">{size.label}</span>
                    <span className="font-body text-xs text-secondary">{deltaText}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* 2. Milk selector — only if options.milks.length > 0 */}
        {item.options.milks.length > 0 && (
          <fieldset className="border-none p-0 m-0">
            <legend className="text-secondary text-sm font-body mb-2 font-medium">Milk</legend>
            <div className="flex flex-wrap gap-2">
              {item.options.milks.map((milk) => {
                const isSelected = selectedMilk === milk;
                return (
                  <label
                    key={milk}
                    className={[
                      'flex items-center gap-2 px-3 py-2 rounded-input border cursor-pointer',
                      'min-h-[44px] transition-colors duration-150',
                      isSelected
                        ? 'border-accent bg-surface-raised shadow-[0_0_0_1px_theme(colors.accent)]'
                        : 'border-border hover:border-accent/50',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="milk"
                      value={milk}
                      checked={isSelected}
                      onChange={() => setSelectedMilk(milk)}
                      className="sr-only"
                    />
                    <span className="font-body text-sm text-primary">{milk}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* 3. Temperature selector — static label if 1 option, selector if >1, hidden if 0 */}
        {item.options.temperatures.length === 1 ? (
          <div>
            <p className="text-secondary text-sm font-body">
              <span className="font-medium">Temperature:</span> {item.options.temperatures[0]}
            </p>
          </div>
        ) : item.options.temperatures.length > 1 ? (
          <fieldset className="border-none p-0 m-0">
            <legend className="text-secondary text-sm font-body mb-2 font-medium">Temperature</legend>
            <div className="flex flex-wrap gap-2">
              {item.options.temperatures.map((temp) => {
                const isSelected = selectedTemp === temp;
                return (
                  <label
                    key={temp}
                    className={[
                      'flex items-center gap-2 px-3 py-2 rounded-input border cursor-pointer',
                      'min-h-[44px] transition-colors duration-150',
                      isSelected
                        ? 'border-accent bg-surface-raised shadow-[0_0_0_1px_theme(colors.accent)]'
                        : 'border-border hover:border-accent/50',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="temperature"
                      value={temp}
                      checked={isSelected}
                      onChange={() => setSelectedTemp(temp)}
                      className="sr-only"
                    />
                    <span className="font-body text-sm text-primary">{temp}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        {/* 4. Shot count — ONLY if options.shots is non-null (espresso only) */}
        {item.options.shots !== null && (
          <fieldset className="border-none p-0 m-0">
            <legend className="text-secondary text-sm font-body mb-2 font-medium">Shots</legend>
            <div className="flex flex-wrap gap-2">
              {item.options.shots.map((shot) => {
                const isSelected = selectedShots === shot;
                return (
                  <label
                    key={shot}
                    className={[
                      'flex items-center gap-2 px-3 py-2 rounded-input border cursor-pointer',
                      'min-h-[44px] transition-colors duration-150',
                      isSelected
                        ? 'border-accent bg-surface-raised shadow-[0_0_0_1px_theme(colors.accent)]'
                        : 'border-border hover:border-accent/50',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="shots"
                      value={shot}
                      checked={isSelected}
                      onChange={() => setSelectedShots(shot)}
                      className="sr-only"
                    />
                    <span className="font-body text-sm text-primary">{shot}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* 5. Extras — only if options.extras.length > 0 */}
        {item.options.extras.length > 0 && (
          <fieldset className="border-none p-0 m-0">
            <legend className="text-secondary text-sm font-body mb-2 font-medium">Add-ons</legend>
            <div className="flex flex-wrap gap-2">
              {item.options.extras.map((extra) => {
                const isSelected = selectedAddons.includes(extra.label);
                return (
                  <label
                    key={extra.label}
                    className={[
                      'flex items-center gap-2 px-3 py-2 rounded-input border cursor-pointer',
                      'min-h-[44px] transition-colors duration-150',
                      isSelected
                        ? 'border-accent bg-surface-raised shadow-[0_0_0_1px_theme(colors.accent)]'
                        : 'border-border hover:border-accent/50',
                    ].join(' ')}
                  >
                    <input
                      type="checkbox"
                      value={extra.label}
                      checked={isSelected}
                      onChange={() => toggleAddon(extra.label)}
                      className="sr-only"
                    />
                    <span className="font-body text-sm text-primary">{extra.label}</span>
                    <span className="font-body text-xs text-secondary">+${extra.price.toFixed(2)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* 6. Special instructions */}
        <div>
          <label
            htmlFor="special-instructions"
            className="block text-secondary text-sm font-body mb-2 font-medium"
          >
            Special Instructions
          </label>
          <textarea
            id="special-instructions"
            maxLength={200}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            rows={3}
            placeholder="Any special requests? (e.g. extra hot, no foam)"
            className={[
              'w-full px-3 py-2 rounded-input border bg-surface text-primary font-body text-sm',
              'placeholder:text-secondary/60 resize-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised',
              'border-border',
            ].join(' ')}
          />
          <span
            className={[
              'block text-right text-xs font-body mt-1',
              specialInstructions.length >= 190 ? 'text-error' : 'text-secondary',
            ].join(' ')}
          >
            {specialInstructions.length}/200
          </span>
        </div>

        {/* 7. Quantity stepper */}
        <div className="flex items-center gap-4">
          <span className="text-secondary text-sm font-body font-medium">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className={[
                'flex items-center justify-center min-h-[44px] min-w-[44px] rounded-input border',
                'font-body text-lg font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised',
                quantity <= 1
                  ? 'border-border text-secondary/40 cursor-not-allowed'
                  : 'border-border text-primary hover:border-accent hover:text-accent cursor-pointer',
              ].join(' ')}
            >
              −
            </button>
            <span className="font-body text-lg font-semibold text-primary min-w-[2ch] text-center">
              {quantity}
            </span>
            <button
              aria-label="Increase quantity"
              disabled={quantity >= 10}
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className={[
                'flex items-center justify-center min-h-[44px] min-w-[44px] rounded-input border',
                'font-body text-lg font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised',
                quantity >= 10
                  ? 'border-border text-secondary/40 cursor-not-allowed'
                  : 'border-border text-primary hover:border-accent hover:text-accent cursor-pointer',
              ].join(' ')}
            >
              +
            </button>
          </div>
        </div>

        {/* Footer: price + Add to Cart */}
        <div className="sticky bottom-0 bg-surface-raised border-t border-border pt-4 flex items-center justify-between gap-4 -mx-6 px-6 pb-0">
          <div className="flex flex-col">
            <span className="font-body text-sm text-secondary">${perItemPrice.toFixed(2)} each</span>
            <span className="font-display text-lg font-semibold text-primary">
              Total: ${totalPrice.toFixed(2)}
            </span>
          </div>
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── CustomizationModal ───────────────────────────────────────

interface CustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizationModal({ item, isOpen, onClose }: CustomizationModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus first element when modal opens
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusable = getFocusableElements(modalRef.current);
    if (focusable.length > 0) {
      requestAnimationFrame(() => focusable[0].focus());
    }
  }, [isOpen]);

  // Focus trap — Tab/Shift+Tab cycles within modal
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = getFocusableElements(modalRef.current);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  const contentVariants = shouldReduceMotion ? {} : modalVariants;
  const mobileVariants = shouldReduceMotion ? {} : drawerVariantsBottom;
  const bkdropVariants = shouldReduceMotion ? {} : backdropVariants;

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-canvas/80 backdrop-blur-sm z-50"
            variants={bkdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Mobile bottom sheet (shown below md, hidden at md+) */}
          <motion.div
            className="md:hidden fixed bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-surface-raised rounded-t-2xl z-50"
            variants={mobileVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <ModalContent item={item} onClose={onClose} titleId={titleId} />
          </motion.div>

          {/* Desktop centered dialog (hidden below md, shown at md+) */}
          <div className="hidden md:flex fixed inset-0 items-center justify-center z-50 px-4">
            <motion.div
              className="relative bg-surface-raised rounded-xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <ModalContent
                item={item}
                onClose={onClose}
                titleId={titleId}
                modalRef={modalRef}
                onKeyDown={handleKeyDown}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
