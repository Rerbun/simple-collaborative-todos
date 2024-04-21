import { text, error } from '@sveltejs/kit';
import cycle from 'cycle';
import { saveTodo, getTodoById } from '../../../utils/database-utils.server';
import type { Todo } from '../../../interfaces/Todo';
import { publishedTodo } from '../../../stores/collaboration.server';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const todo: Todo = cycle.retrocycle(await request.json());
  await saveTodo(todo);
  publishedTodo.set(todo);
  return text(todo.id);
}
