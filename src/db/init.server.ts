import path from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database(
  path.resolve(process.env.NODE_ENV === 'production' ? '/data/sqlite.db' : 'data/sqlite.dev.db')
);
export const db = drizzle(sqlite);
