import path from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { eq, desc, inArray } from 'drizzle-orm';
import { diff } from 'json-diff';
import { pick } from 'lodash-es';
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
  const todoEntry: Record<string, any> = (
    await db.select().from(todoTable).where(eq(todoTable.id, id))
  )?.[0];

  if (!todoEntry) return null;
  todoEntry.children = await getChildTodos(todoEntry);
  return Todo.fromObject(todoEntry);
};

const getChildTodos = async (parent: Todo | Record<string, any>) => {
  let output: Record<string, any>[] = [];
  const childEntries = await db.select().from(todoTable).where(eq(todoTable.parentId, parent.id));
  if (childEntries.length === 0) return output;
  await Promise.all(
    childEntries.map(async (child) => {
      const todoChild: Record<string, any> = { parent, ...child };
      todoChild.children = await getChildTodos(todoChild);
      output.push(todoChild);
    })
  );

  return output;
};

// const saveAction = async (id: string, oldState: string, newState: string) => {
//   const changes: { [p: string]: { __old: any; __new: any } } = diff(
//     JSON.parse(oldState),
//     JSON.parse(newState),
//     { outputNewOnly: true }
//   );
//   if (Object.keys(changes).length > 0) {
//     const changeEntries: (typeof todChangesTable.$inferInsert)[] = Object.entries(changes).map(
//       ([property, { __old, __new }]) => ({
//         id,
//         property,
//         oldValue: __old,
//         newValue: __new,
//       })
//     );
//     return db.insert(todChangesTable).values(changeEntries);
//   }
// };

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

export const saveTodo = async (todo: Todo, index: number = null) => {
  let { children, parent } = todo;
  let entry: typeof todoTable.$inferInsert = {
    ...pick(todo, Object.keys(todoTable)),
    parentId: parent?.id,
    index,
  };

  const result = await db
    .insert(todoTable)
    .values(entry)
    .onConflictDoUpdate({
      target: todoTable.id,
      set: entry,
    })
    .returning();
  console.log(result);
  if (result.length === 0) throw new Error(`Failed to save todo ${entry.id}: "${entry.title}"`);

  await syncDeletedChildren(entry.id, children);

  if (children.length > 0) {
    const childPromises = children.map((child, index) => saveTodo(child, index));
    await Promise.all(childPromises);
  }
};

const syncDeletedChildren = async (parentId: string, children: Todo[]) => {
  const currentChildren = await db
    .select()
    .from(todoTable)
    .where(eq(todoTable.parentId, parentId))
    .orderBy(desc(todoTable.index));

  const childrenToDelete = currentChildren.filter(
    (child) => !children.some((newChild) => newChild.id === child.id)
  );

  if (childrenToDelete.length > 0) {
    await db.delete(todoTable).where(
      inArray(
        todoTable.id,
        childrenToDelete.map(({ id }) => id)
      )
    );
  }
};
