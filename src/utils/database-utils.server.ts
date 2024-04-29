import { eq, desc, inArray } from 'drizzle-orm';
import { pick } from 'lodash-es';
import { Todo } from '../interfaces/Todo';
import { todoTable } from '../db/schema.server';
import { db } from '../db/init.server';

export const getTodoById = async (id: string) => {
  const todoEntry: Record<string, any> = (
    await db.select().from(todoTable).where(eq(todoTable.id, id))
  )?.[0];

  if (!todoEntry) return null;
  todoEntry.children = await getChildTodos(todoEntry);
  console.log('Got: ', todoEntry);
  return Todo.fromObject(todoEntry);
};

const getChildTodos = async (parent: Todo | Record<string, any>) => {
  let output: Record<string, any>[] = [];
  const childEntries = await db
    .select()
    .from(todoTable)
    .where(eq(todoTable.parentId, parent.id))
    .orderBy(todoTable.index);
  if (childEntries.length === 0) return output;
  await Promise.all(
    childEntries.map(async (child, index) => {
      const todoChild: Record<string, any> = { parent, ...child };
      todoChild.children = await getChildTodos(todoChild);
      output[index] = todoChild;
    })
  );

  return output;
};

export const saveTodo = async (todo: Todo, index: number = null) => {
  let { children, parent } = todo;
  let entry: typeof todoTable.$inferInsert = {
    ...pick(todo, Object.keys(todoTable)),
    parentId: parent?.id,
    index,
  };
  console.log('Saving: ', entry);
  const result = await db
    .insert(todoTable)
    .values(entry)
    .onConflictDoUpdate({
      target: todoTable.id,
      set: entry,
    })
    .returning();
  console.log('Saved: ', result);
  if (result.length === 0) throw new Error(`Failed to save todo ${entry.id}: "${entry.title}"`);

  await syncDeletedChildren(entry.id, children);

  if (children.length > 0) {
    const childPromises = children.map((child, index) => {
      saveTodo(child, index);
    });
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
