import path from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sql, eq } from 'drizzle-orm';
import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { diff } from 'json-diff';

const todos = sqliteTable('todos', {
  id: text('id').primaryKey().notNull(),
  state: text('state').notNull(),
});

const todoChanges = sqliteTable('todo_changes', {
  property: text('property').notNull(),
  oldValue: text('old_value').notNull(),
  newValue: text('new_value').notNull(),
  id: text('id')
    .notNull()
    .references(() => todos.id),
  timestamp: text('timestamp').default(sql`(CURRENT_TIMESTAMP)`),
});

const sqlite = new Database(path.resolve('sqlite.db'));
const db = drizzle(sqlite);

const getTodoById = async (id: string) => {
  const initialState = (await db.select().from(todos).where(eq(todos.id, id)))?.map(
    (todo) => todo.state
  )[0];
  if (!initialState) return null;
  const changes = await db
    .select()
    .from(todoChanges)
    .where(eq(todoChanges.id, id))
    .orderBy(todoChanges.timestamp);
  return changes.reduce((state, change) => {
    const { property, newValue } = change;
    state[property] = newValue;
    return state;
  }, JSON.parse(initialState));
};

const saveAction = async (id: string, oldState: string, newState: string) => {
  const changes = diff(JSON.parse(oldState), JSON.parse(newState), { outputNewOnly: true });
  if (Object.keys(changes).length > 0) {
    const property = Object.keys(changes)[0];
    const oldValue = changes[property].__old;
    const newValue = changes[property].__new;
    return db
      .insert(todoChanges)
      .values({
        id,
        property,
        oldValue,
        newValue,
      })
      .returning();
  }
};

const saveTodo = async (id: string, state: string) => {
  const todo =
    (await getTodoById(id)) ||
    (
      await db
        .insert(todos)
        .values({ id, state })
        .onConflictDoNothing()
        .returning({ state: todos.state })
    )?.[0]?.state;
  if (todo) {
    await saveAction(id, todo, state);
  }
};
