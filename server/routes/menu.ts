import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import type { MenuItem } from '../types/api.js';

export const menuRouter = Router();

interface MenuItemRow {
  id: number;
  name: string;
  description: string;
  base_price: number;
  category: string;
  drink_type: string;
  has_customizations: number;
  available: number;
  sort_order: number;
  options_json: string;
  created_at: string;
}

function rowToMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    basePrice: row.base_price,
    category: row.category,
    drinkType: row.drink_type,
    hasCustomizations: row.has_customizations === 1,
    available: row.available === 1,
    sortOrder: row.sort_order,
    options: JSON.parse(row.options_json),
    createdAt: row.created_at,
  };
}

// GET /api/menu/categories — MUST be registered BEFORE /:id to avoid Express matching 'categories' as an id
menuRouter.get('/categories', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare(
      'SELECT DISTINCT category FROM menu_items WHERE available = 1 ORDER BY category'
    ).all() as Array<{ category: string }>;
    const categories = rows.map((r) => r.category);
    res.status(200).json({ data: categories, error: null, status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ data: null, error: { code: 'DB_READ_ERROR', message }, status: 500 });
  }
});

// GET /api/menu
menuRouter.get('/', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare(
      'SELECT * FROM menu_items WHERE available = 1 ORDER BY category, sort_order, name'
    ).all() as MenuItemRow[];
    const items: MenuItem[] = rows.map(rowToMenuItem);
    res.status(200).json({ data: items, error: null, status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ data: null, error: { code: 'DB_READ_ERROR', message }, status: 500 });
  }
});

// GET /api/menu/:id
menuRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params['id'] ?? '', 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      data: null,
      error: { code: 'INVALID_ID', message: 'Invalid ID' },
      status: 400,
    });
  }

  try {
    const row = db.prepare(
      'SELECT * FROM menu_items WHERE id = ? AND available = 1'
    ).get(id) as MenuItemRow | undefined;

    if (!row) {
      return res.status(404).json({
        data: null,
        error: { code: 'ITEM_NOT_FOUND', message: 'Item not found' },
        status: 404,
      });
    }

    return res.status(200).json({ data: rowToMenuItem(row), error: null, status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ data: null, error: { code: 'DB_READ_ERROR', message }, status: 500 });
  }
});
