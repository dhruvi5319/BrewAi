import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './server/db/database.js';
import { menuRouter } from './server/routes/menu.js';
import { ordersRouter } from './server/routes/orders.js';
import { errorHandler } from './server/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
const HOST = process.env['HOST'] ?? '0.0.0.0';

// Middleware chain: cors() → express.json() → API routes → static(dist/) → SPA fallback → errorHandler
app.use(cors({
  origin: process.env['NODE_ENV'] === 'production' ? false : 'http://localhost:5173',
}));
app.use(express.json());

// API routes
app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);

// Unknown API routes — return JSON 404 (before SPA fallback for /api/* paths)
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({
    data: null,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
    status: 404,
  });
});

// Serve Vite production build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback — all non-API routes serve index.html
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Global error handler (must be last)
app.use(errorHandler);

// Initialize database synchronously before accepting requests
initDatabase();

// CRITICAL: Bind to 0.0.0.0 (not 127.0.0.1) for sandbox container access
app.listen(PORT, HOST, () => {
  console.log(`BrewAI server running on http://${HOST}:${PORT}`);
});

export default app;
