import { Router } from 'express';
import { db } from '../db/database.js';
export const menuRouter = Router();
function rowToMenuItem(row) {
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
menuRouter.get('/categories', (_req, res) => {
    try {
        const rows = db.prepare('SELECT DISTINCT category FROM menu_items WHERE available = 1 ORDER BY category').all();
        const categories = rows.map((r) => r.category);
        res.status(200).json({ data: categories, error: null, status: 200 });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        res.status(500).json({ data: null, error: { code: 'DB_READ_ERROR', message }, status: 500 });
    }
});
// GET /api/menu
menuRouter.get('/', (_req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM menu_items WHERE available = 1 ORDER BY category, sort_order, name').all();
        const items = rows.map(rowToMenuItem);
        res.status(200).json({ data: items, error: null, status: 200 });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        res.status(500).json({ data: null, error: { code: 'DB_READ_ERROR', message }, status: 500 });
    }
});
// GET /api/menu/:id
menuRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params['id'] ?? '', 10);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            data: null,
            error: { code: 'INVALID_ID', message: 'Invalid ID' },
            status: 400,
        });
    }
    try {
        const row = db.prepare('SELECT * FROM menu_items WHERE id = ? AND available = 1').get(id);
        if (!row) {
            return res.status(404).json({
                data: null,
                error: { code: 'ITEM_NOT_FOUND', message: 'Item not found' },
                status: 404,
            });
        }
        return res.status(200).json({ data: rowToMenuItem(row), error: null, status: 200 });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({ data: null, error: { code: 'DB_READ_ERROR', message }, status: 500 });
    }
});
