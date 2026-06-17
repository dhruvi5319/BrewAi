// Shared API Types — server/types/api.ts

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
