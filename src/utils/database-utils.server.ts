import path from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import { diff } from 'json-diff';
import { Todo } from '../interfaces/Todo';
import { todoTable, todChangesTable } from '../db/schema.server';

const sqlite = new Database(
  path.resolve(process.env.NODE_ENV === 'production' ? '/data/sqlite.db' : 'data/sqlite.dev.db')
);
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: 'migrations' });

// const getTodoById = async (id: string) => {
//   const initialState = (await db.select().from(todoTable).where(eq(todoTable.id, id)))?.map(
//     (todo) => todo.state
//   )[0];
//   if (!initialState) return null;
//   const changes = await db
//     .select()
//     .from(todChangesTable)
//     .where(eq(todChangesTable.id, id))
//     .orderBy(todChangesTable.timestamp);
//   return changes.reduce((state, change) => {
//     const { property, newValue } = change;
//     state[property] = newValue;
//     return state;
//   }, JSON.parse(initialState));
// };

export const getTodoById = async (id: string) => {
  const todoEntry = Todo.fromObject(
    (await db.select().from(todoTable).where(eq(todoTable.id, id)))?.[0]
  );
  if (!todoEntry) return null;
  const todo = Todo.fromObject(todoEntry);
  todo.children = await getChildTodos(todo);
  return todo;
};

const getChildTodos = async (parent: Todo) => {
  let output: Todo[] = [];
  const childEntries = await db.select().from(todoTable).where(eq(todoTable.parentId, parent.id));
  if (childEntries.length === 0) return output;
  Promise.all(
    childEntries.map(async (child) => {
      const todoChild = Todo.fromObject({ parent, ...child });
      todoChild.children = await getChildTodos(todoChild);
      output.push(todoChild);
    })
  );

  return output;
};

const saveAction = async (id: string, oldState: string, newState: string) => {
  const changes: { [p: string]: { __old: any; __new: any } } = diff(
    JSON.parse(oldState),
    JSON.parse(newState),
    { outputNewOnly: true }
  );
  if (Object.keys(changes).length > 0) {
    const changeEntries: (typeof todChangesTable.$inferInsert)[] = Object.entries(changes).map(
      ([property, { __old, __new }]) => ({
        id,
        property,
        oldValue: __old,
        newValue: __new,
      })
    );
    return db.insert(todChangesTable).values(changeEntries);
  }
};

// const saveTodo = async (id: string, state: string) => {
//   const todo =
//     (await getTodoById(id)) ||
//     (
//       await db
//         .insert(todoTable)
//         .values({ id, state })
//         .onConflictDoNothing()
//         .returning({ state: todoTable.state })
//     )?.[0]?.state;
//   if (todo) {
//     await saveAction(id, todo, state);
//   }
// };

export const saveTodo = async (todo: Todo) => {
  let { children, parent, ...cleanTodo } = todo;
  let entry = { ...cleanTodo, parentId: parent?.id };

  const result = await db
    .insert(todoTable)
    .values(entry)
    .onConflictDoUpdate({
      target: todoTable.id,
      set: entry,
    })
    .returning();
  console.log(result);
  if (result.length === 0) throw new Error(`Failed to save todo ${entry.id}:${entry.title}`);

  if (children.length > 0) {
    await Promise.all(children.map((child) => saveTodo(child)));
  }
};
