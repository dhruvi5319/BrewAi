import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import type {
  ApiResponse,
  OrderPayload,
  OrderLineItem,
  OrderResponse,
  OrderResponseItem,
  OrderLineItemCustomizations,
} from '../types/api';

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

function validateOrderPayload(body: unknown): { valid: true; payload: OrderPayload } | { valid: false; code: string; field?: string; message: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, code: 'INVALID_PAYLOAD', message: 'Request body must be an object' };
  }

  const b = body as Record<string, unknown>;

  // Validate items
  if (!Array.isArray(b.items) || b.items.length === 0) {
    return { valid: false, code: 'EMPTY_ORDER', field: 'items', message: 'Order must contain at least one item' };
  }
  if (b.items.length > 50) {
    return { valid: false, code: 'INVALID_PAYLOAD', field: 'items', message: 'Order cannot exceed 50 items' };
  }

  // Validate subtotal
  if (typeof b.subtotal !== 'number' || b.subtotal <= 0) {
    return { valid: false, code: 'INVALID_PAYLOAD', field: 'subtotal', message: 'subtotal must be a positive number' };
  }

  // Validate each line item
  for (let i = 0; i < b.items.length; i++) {
    const item = b.items[i] as Record<string, unknown>;

    if (!Number.isInteger(item.menuItemId) || (item.menuItemId as number) <= 0) {
      return { valid: false, code: 'INVALID_PAYLOAD', field: `items[${i}].menuItemId`, message: 'menuItemId must be a positive integer' };
    }

    if (typeof item.name !== 'string' || item.name.length < 1 || item.name.length > 200) {
      return { valid: false, code: 'INVALID_PAYLOAD', field: `items[${i}].name`, message: 'name must be 1-200 characters' };
    }

    if (typeof item.unitPrice !== 'number' || item.unitPrice <= 0) {
      return { valid: false, code: 'INVALID_PAYLOAD', field: `items[${i}].unitPrice`, message: 'unitPrice must be a positive number' };
    }

    if (!Number.isInteger(item.quantity) || (item.quantity as number) < 1 || (item.quantity as number) > 10) {
      return { valid: false, code: 'INVALID_PAYLOAD', field: `items[${i}].quantity`, message: 'quantity must be between 1 and 10' };
    }

    if (!item.customizations || typeof item.customizations !== 'object') {
      return { valid: false, code: 'INVALID_PAYLOAD', field: `items[${i}].customizations`, message: 'customizations is required' };
    }

    const c = item.customizations as Record<string, unknown>;
    if (typeof c.size !== 'string' || c.size.length < 1 || c.size.length > 50) {
      return { valid: false, code: 'INVALID_PAYLOAD', field: `items[${i}].customizations.size`, message: 'size must be 1-50 characters' };
    }
  }

  // Build sanitized payload
  const items: OrderLineItem[] = (b.items as Record<string, unknown>[]).map((item) => {
    const c = item.customizations as Record<string, unknown>;
    const specialInstructions = typeof c.specialInstructions === 'string'
      ? c.specialInstructions.slice(0, 200)
      : '';

    const customizations: OrderLineItemCustomizations = {
      size: c.size as string,
      milk: typeof c.milk === 'string' ? c.milk : null,
      temperature: typeof c.temperature === 'string' ? c.temperature : null,
      shots: typeof c.shots === 'string' ? c.shots : null,
      addons: Array.isArray(c.addons) ? (c.addons as string[]) : [],
      specialInstructions,
    };

    return {
      menuItemId: item.menuItemId as number,
      name: item.name as string,
      unitPrice: Math.round((item.unitPrice as number) * 100) / 100,
      quantity: item.quantity as number,
      customizations,
    };
  });

  const notes = typeof b.notes === 'string' ? b.notes.slice(0, 500) : '';

  return {
    valid: true,
    payload: {
      items,
      subtotal: b.subtotal as number,
      notes,
    },
  };
}

// POST /api/orders
ordersRouter.post('/', (req: Request, res: Response) => {
  const validation = validateOrderPayload(req.body);

  if (!validation.valid) {
    res.status(400).json({
      data: null,
      error: {
        code: validation.code,
        message: validation.message,
        ...(validation.field ? { field: validation.field } : {}),
      },
      status: 400,
    });
    return;
  }

  const { payload } = validation;

  try {
    const insertOrder = db.prepare(
      'INSERT INTO orders (subtotal, notes) VALUES (?, ?)'
    );
    const insertItem = db.prepare(
      'INSERT INTO order_items (order_id, menu_item_id, name, unit_price, quantity, customizations_json) VALUES (?, ?, ?, ?, ?, ?)'
    );

    const transaction = db.transaction((p: OrderPayload) => {
      const orderResult = insertOrder.run(p.subtotal, p.notes);
      const orderId = orderResult.lastInsertRowid as number;

      for (const item of p.items) {
        insertItem.run(
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

    const orderId = transaction(payload);
    const orderReference = `BRW-${String(orderId).padStart(5, '0')}`;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as OrderRow;

    const response: ApiResponse<OrderResponse> = {
      data: {
        orderId,
        orderReference,
        createdAt: order.created_at,
        subtotal: order.subtotal,
        status: order.status,
        notes: order.notes,
        items: payload.items.map((item, _idx) => ({
          id: 0, // placeholder — not queried back for perf
          menuItemId: item.menuItemId,
          name: item.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          customizations: item.customizations,
        })),
      },
      error: null,
      status: 201,
    };
    res.status(201).json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database write failed';
    res.status(500).json({
      data: null,
      error: { code: 'DB_WRITE_ERROR', message },
      status: 500,
    });
  }
});

// GET /api/orders/:id
ordersRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      data: null,
      error: { code: 'INVALID_ID', message: 'Invalid ID' },
      status: 400,
    });
    return;
  }

  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderRow | undefined;

    if (!order) {
      res.status(404).json({
        data: null,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
        status: 404,
      });
      return;
    }

    const itemRows = db.prepare(
      'SELECT * FROM order_items WHERE order_id = ? ORDER BY id'
    ).all(id) as OrderItemRow[];

    const orderReference = `BRW-${String(order.id).padStart(5, '0')}`;

    const items: OrderResponseItem[] = itemRows.map((row) => ({
      id: row.id,
      menuItemId: row.menu_item_id,
      name: row.name,
      unitPrice: row.unit_price,
      quantity: row.quantity,
      customizations: JSON.parse(row.customizations_json) as OrderLineItemCustomizations,
    }));

    const response: ApiResponse<OrderResponse> = {
      data: {
        orderId: order.id,
        orderReference,
        createdAt: order.created_at,
        subtotal: order.subtotal,
        status: order.status,
        notes: order.notes,
        items,
      },
      error: null,
      status: 200,
    };
    res.status(200).json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database read failed';
    res.status(500).json({
      data: null,
      error: { code: 'DB_READ_ERROR', message },
      status: 500,
    });
  }
});
