import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import type { OrderPayload, OrderLineItem, OrderResponse, OrderResponseItem, OrderLineItemCustomizations } from '../types/api.js';

export const ordersRouter = Router();

interface OrderRow {
  id: number;
  subtotal: number;
  notes: string;
  status: string;
  created_at: string;
}

interface OrderItemRow {
  id: number;
  order_id: number;
  menu_item_id: number;
  name: string;
  unit_price: number;
  quantity: number;
  customizations_json: string;
  created_at: string;
}

function validateOrderPayload(body: unknown): { valid: true; payload: OrderPayload } | { valid: false; error: string; field?: string } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Invalid request body' };
  }

  const b = body as Record<string, unknown>;

  // Validate items
  if (!Array.isArray(b['items']) || b['items'].length === 0) {
    return { valid: false, error: 'Order must contain at least one item', field: 'items' };
  }
  if (b['items'].length > 50) {
    return { valid: false, error: 'Order cannot exceed 50 items', field: 'items' };
  }

  // Validate subtotal
  if (typeof b['subtotal'] !== 'number' || b['subtotal'] <= 0) {
    return { valid: false, error: 'Invalid subtotal', field: 'subtotal' };
  }

  // Validate each line item
  for (let i = 0; i < b['items'].length; i++) {
    const item = b['items'][i] as Record<string, unknown>;

    if (!Number.isInteger(item['menuItemId']) || (item['menuItemId'] as number) <= 0) {
      return { valid: false, error: `Invalid menuItemId at index ${i}`, field: `items[${i}].menuItemId` };
    }
    if (typeof item['name'] !== 'string' || item['name'].length < 1 || item['name'].length > 200) {
      return { valid: false, error: `Invalid name at index ${i}`, field: `items[${i}].name` };
    }
    if (typeof item['unitPrice'] !== 'number' || item['unitPrice'] <= 0) {
      return { valid: false, error: `Invalid unitPrice at index ${i}`, field: `items[${i}].unitPrice` };
    }
    if (!Number.isInteger(item['quantity']) || (item['quantity'] as number) < 1 || (item['quantity'] as number) > 10) {
      return { valid: false, error: `Invalid quantity at index ${i}`, field: `items[${i}].quantity` };
    }
    if (typeof item['customizations'] !== 'object' || item['customizations'] === null) {
      return { valid: false, error: `Missing customizations at index ${i}`, field: `items[${i}].customizations` };
    }
    const cust = item['customizations'] as Record<string, unknown>;
    if (typeof cust['size'] !== 'string' || cust['size'].length < 1 || cust['size'].length > 50) {
      return { valid: false, error: `Invalid size at index ${i}`, field: `items[${i}].customizations.size` };
    }
  }

  // Build validated payload
  const items: OrderLineItem[] = (b['items'] as Array<Record<string, unknown>>).map((item) => {
    const cust = item['customizations'] as Record<string, unknown>;
    const specialInstructions = typeof cust['specialInstructions'] === 'string'
      ? cust['specialInstructions'].slice(0, 200)
      : '';
    const customizations: OrderLineItemCustomizations = {
      size: cust['size'] as string,
      milk: typeof cust['milk'] === 'string' ? cust['milk'] : null,
      temperature: typeof cust['temperature'] === 'string' ? cust['temperature'] : null,
      shots: typeof cust['shots'] === 'string' ? cust['shots'] : null,
      addons: Array.isArray(cust['addons']) ? cust['addons'] as string[] : [],
      specialInstructions,
    };
    return {
      menuItemId: item['menuItemId'] as number,
      name: item['name'] as string,
      unitPrice: Math.round((item['unitPrice'] as number) * 100) / 100,
      quantity: item['quantity'] as number,
      customizations,
    };
  });

  const notes = typeof b['notes'] === 'string' ? b['notes'].slice(0, 500) : '';

  return {
    valid: true,
    payload: {
      items,
      subtotal: b['subtotal'] as number,
      notes,
    },
  };
}

// POST /api/orders
ordersRouter.post('/', (req: Request, res: Response) => {
  const validation = validateOrderPayload(req.body);
  if (!validation.valid) {
    const code = validation.field === 'items' && (req.body?.items === undefined || (Array.isArray(req.body?.items) && req.body.items.length === 0))
      ? 'EMPTY_ORDER'
      : 'INVALID_PAYLOAD';
    return res.status(400).json({
      data: null,
      error: { code, message: validation.error, field: validation.field },
      status: 400,
    });
  }

  const { payload } = validation;

  try {
    let orderId: number;

    const insertOrder = db.prepare(
      'INSERT INTO orders (subtotal, notes) VALUES (?, ?)'
    );
    const insertOrderItem = db.prepare(
      'INSERT INTO order_items (order_id, menu_item_id, name, unit_price, quantity, customizations_json) VALUES (?, ?, ?, ?, ?, ?)'
    );

    const createOrder = db.transaction(() => {
      const orderResult = insertOrder.run(payload.subtotal, payload.notes);
      orderId = orderResult.lastInsertRowid as number;

      for (const item of payload.items) {
        insertOrderItem.run(
          orderId,
          item.menuItemId,
          item.name,
          item.unitPrice,
          item.quantity,
          JSON.stringify(item.customizations)
        );
      }

      return orderId;
    });

    orderId = createOrder();

    const orderReference = `BRW-${String(orderId).padStart(5, '0')}`;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as OrderRow;
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id').all(orderId) as OrderItemRow[];

    const response: OrderResponse = {
      orderId: order.id,
      orderReference,
      createdAt: order.created_at,
      subtotal: order.subtotal,
      status: order.status,
      notes: order.notes || undefined,
      items: orderItems.map((item): OrderResponseItem => ({
        id: item.id,
        menuItemId: item.menu_item_id,
        name: item.name,
        unitPrice: item.unit_price,
        quantity: item.quantity,
        customizations: JSON.parse(item.customizations_json) as OrderLineItemCustomizations,
      })),
    };

    return res.status(201).json({ data: response, error: null, status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ data: null, error: { code: 'DB_WRITE_ERROR', message }, status: 500 });
  }
});

// GET /api/orders/:id
ordersRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params['id'] ?? '', 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      data: null,
      error: { code: 'INVALID_ID', message: 'Invalid ID' },
      status: 400,
    });
  }

  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderRow | undefined;

    if (!order) {
      return res.status(404).json({
        data: null,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
        status: 404,
      });
    }

    const orderItems = db.prepare(
      'SELECT * FROM order_items WHERE order_id = ? ORDER BY id'
    ).all(id) as OrderItemRow[];

    const orderReference = `BRW-${String(order.id).padStart(5, '0')}`;

    const response: OrderResponse = {
      orderId: order.id,
      orderReference,
      createdAt: order.created_at,
      subtotal: order.subtotal,
      status: order.status,
      notes: order.notes || undefined,
      items: orderItems.map((item): OrderResponseItem => ({
        id: item.id,
        menuItemId: item.menu_item_id,
        name: item.name,
        unitPrice: item.unit_price,
        quantity: item.quantity,
        customizations: JSON.parse(item.customizations_json) as OrderLineItemCustomizations,
      })),
    };

    return res.status(200).json({ data: response, error: null, status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ data: null, error: { code: 'DB_READ_ERROR', message }, status: 500 });
  }
});
