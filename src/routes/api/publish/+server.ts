import { error, text } from '@sveltejs/kit';
import cycle from 'cycle';
import { saveTodo } from '../../../utils/database-utils.server';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const todo = cycle.retrocycle(await request.json());
  saveTodo(todo);
  return text('');
}
