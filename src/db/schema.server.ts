import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const todoTable = sqliteTable('todos', {
  id: text('id').primaryKey().unique().notNull(),
  parentId: text('parentId').references((): AnySQLiteColumn => todoTable.id, {
    onDelete: 'cascade',
  }),
  status: text('status').notNull(),
  title: text('title'),
  index: integer('index'),
});

export const todChangesTable = sqliteTable('todo_changes', {
  property: text('property').notNull(),
  oldValue: text('old_value').notNull(),
  newValue: text('new_value').notNull(),
  id: text('id')
    .notNull()
    .references(() => todoTable.id),
  timestamp: text('timestamp').default(sql`(unixepoch())`),
});
