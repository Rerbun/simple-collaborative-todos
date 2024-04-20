import { text } from '@sveltejs/kit';
import cycle from 'cycle';
import { saveTodo } from '../../../utils/database-utils.server';
import type { Todo } from '../../../interfaces/Todo';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const todo: Todo = cycle.retrocycle(await request.json());
  await saveTodo(todo);
  return text(todo.id);
}
