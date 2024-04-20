import { error, text } from '@sveltejs/kit';
import cycle from 'cycle';
import { saveTodo } from '../../../utils/database-utils.server';
import { Todo } from '../interfaces/Todo';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const todo: Todo = cycle.retrocycle(await request.json());
  saveTodo(todo);
  return text(todo.id);
}
