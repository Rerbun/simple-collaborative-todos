import { text } from '@sveltejs/kit';
import cycle from 'cycle';
import { saveTodo } from '../../../utils/database-utils.server';
import type { Todo } from '../../../interfaces/Todo';
import { onUpdateSent, sendToClients } from '../../../utils/sse-utils.server';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const todo: Todo = cycle.retrocycle(await request.json());
  await saveTodo(todo);

  const promise = new Promise((resolve) => {
    onUpdateSent(resolve, true);
  });

  sendToClients(todo);

  await promise;
  return text(todo.id);
}
