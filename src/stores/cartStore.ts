import { create } from 'zustand';
import type { CartItem, CartItemCustomizations } from '../types/index';

function canonicalCustomizations(c: CartItemCustomizations): string {
  return JSON.stringify({
    size: c.size,
    milk: c.milk,
    temperature: c.temperature,
    shots: c.shots,
    addons: [...c.addons].sort(),
    specialInstructions: c.specialInstructions,
  });
}

function computeDerived(items: CartItem[]) {
  return {
    totalCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
  };
}

interface CartState {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalCount: 0,
  subtotal: 0,
  isOpen: false,

  addItem: (newItem) =>
    set((state) => {
      const newKey = canonicalCustomizations(newItem.customizations);
      const existingIdx = state.items.findIndex(
        (i) =>
          i.menuItemId === newItem.menuItemId &&
          canonicalCustomizations(i.customizations) === newKey
      );
      let updatedItems: CartItem[];
      if (existingIdx >= 0) {
        updatedItems = state.items.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: Math.min(10, item.quantity + newItem.quantity) }
            : item
        );
      } else {
        updatedItems = [...state.items, newItem];
      }
      return { items: updatedItems, ...computeDerived(updatedItems) };
    }),

  removeItem: (cartItemId) =>
    set((state) => {
      if (!state.items.some((i) => i.cartItemId === cartItemId)) {
        console.warn(`cartStore.removeItem: cartItemId ${cartItemId} not found`);
        return state;
      }
      const updatedItems = state.items.filter((i) => i.cartItemId !== cartItemId);
      return { items: updatedItems, ...computeDerived(updatedItems) };
    }),

  updateQuantity: (cartItemId, quantity) =>
    set((state) => {
      const clampedQty = Math.min(10, Math.max(1, quantity));
      const updatedItems = state.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: clampedQty } : i
      );
      return { items: updatedItems, ...computeDerived(updatedItems) };
    }),

  clearCart: () => set({ items: [], totalCount: 0, subtotal: 0 }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
