import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './init.server';

migrate(db, { migrationsFolder: 'migrations' });
