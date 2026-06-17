import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
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
const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

// Middleware chain: cors() → express.json() → API routes → static(dist/) → SPA fallback → errorHandler
app.use(cors({
  origin: process.env['NODE_ENV'] === 'production' ? false : true,
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

// Serve Vite production build (only if dist exists)
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));

  // SPA fallback — all non-API routes serve index.html
  app.get('*', (_req: Request, res: Response, next: NextFunction) => {
    if (fs.existsSync(INDEX_HTML)) {
      res.sendFile(INDEX_HTML);
    } else {
      next();
    }
  });
} else {
  // Dev mode: no dist build — frontend is served by Vite on port 5173
  app.get('/', (_req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'BrewAI API — frontend served by Vite dev server on port 5173' });
  });
}

// Global error handler (must be last)
app.use(errorHandler);

// Initialize database synchronously before accepting requests
initDatabase();

// CRITICAL: Bind to 0.0.0.0 (not 127.0.0.1) for sandbox container access
app.listen(PORT, HOST, () => {
  console.log(`BrewAI server running on http://${HOST}:${PORT}`);
});

export default app;
