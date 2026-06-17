// ============================================================
// Shared API Types — src/types/index.ts (frontend)
// ============================================================

// ─── Common Envelope ─────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

// ─── Menu Types ──────────────────────────────────────────────

export interface SizeOption {
  label: string;
  delta: number;
}

export interface ExtraOption {
  label: string;
  price: number;
}

export interface ItemOptions {
  sizes:        SizeOption[];
  milks:        string[];
  temperatures: string[];
  shots:        string[] | null;
  extras:       ExtraOption[];
}

export interface MenuItem {
  id:                number;
  name:              string;
  description:       string;
  basePrice:         number;
  category:          string;
  drinkType:         string;
  hasCustomizations: boolean;
  available:         boolean;
  sortOrder:         number;
  options:           ItemOptions;
  createdAt:         string;
}

// ─── Cart Types (client-side only) ───────────────────────────

export interface CartItemCustomizations {
  size:                string;
  milk:                string | null;
  temperature:         string | null;
  shots:               string | null;
  addons:              string[];
  specialInstructions: string;
}

export interface CartItem {
  cartItemId:     string;
  menuItemId:     number;
  name:           string;
  unitPrice:      number;
  quantity:       number;
  customizations: CartItemCustomizations;
}

export interface CartStore {
  items:          CartItem[];
  totalCount:     number;
  subtotal:       number;
  isOpen:         boolean;
  addItem:        (item: CartItem) => void;
  removeItem:     (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart:      () => void;
  openCart:       () => void;
  closeCart:      () => void;
}

// ─── Menu Store (client-side only) ───────────────────────────

export interface MenuStore {
  items:          MenuItem[];
  categories:     string[];
  loading:        boolean;
  error:          string | null;
  activeCategory: string;
  searchQuery:    string;
  filteredItems:  MenuItem[];
  fetchMenu:      () => Promise<void>;
  setCategory:    (category: string) => void;
  setSearch:      (query: string) => void;
  clearFilters:   () => void;
}

// ─── Order Types ─────────────────────────────────────────────

export interface OrderLineItemCustomizations {
  size:                string;
  milk:                string | null;
  temperature:         string | null;
  shots:               string | null;
  addons:              string[];
  specialInstructions: string;
}

export interface OrderLineItem {
  menuItemId:     number;
  name:           string;
  unitPrice:      number;
  quantity:       number;
  customizations: OrderLineItemCustomizations;
}

export interface OrderPayload {
  items:    OrderLineItem[];
  subtotal: number;
  notes:    string;
}

export interface OrderResponseItem {
  id:             number;
  menuItemId:     number;
  name:           string;
  unitPrice:      number;
  quantity:       number;
  customizations: OrderLineItemCustomizations;
}

export interface OrderResponse {
  orderId:        number;
  orderReference: string;
  createdAt:      string;
  subtotal:       number;
  status:         string;
  notes?:         string;
  items:          OrderResponseItem[];
}
