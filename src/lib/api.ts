import type { ApiResponse, MenuItem, OrderPayload, OrderResponse } from '../types/index';

const BASE_URL = '/api';  // Relative — works in dev (proxied) and prod (same origin)

async function apiFetch<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    ...options,
  });
  return res.json() as Promise<ApiResponse<T>>;
}

export const api = {
  getMenu:       ()                        => apiFetch<MenuItem[]>('/menu'),
  getCategories: ()                        => apiFetch<string[]>('/menu/categories'),
  getMenuItem:   (id: number)              => apiFetch<MenuItem>(`/menu/${id}`),
  createOrder:   (payload: OrderPayload)   =>
                   apiFetch<OrderResponse>('/orders', {
                     method: 'POST',
                     body: JSON.stringify(payload),
                   }),
  getOrder:      (id: number)              => apiFetch<OrderResponse>(`/orders/${id}`),
};
