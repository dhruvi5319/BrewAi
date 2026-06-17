import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { createSchema } from './schema.js';
import { seedMenu } from './seed.js';

const DB_PATH = process.env.DB_PATH ?? './data/brewai.db';

// Ensure the data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(DB_PATH);

// Enable WAL mode and foreign keys (from TechArch §2.1)
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase(): void {
  createSchema(db);
  seedMenu(db);
}
