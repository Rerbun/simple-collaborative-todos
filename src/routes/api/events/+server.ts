import { events } from 'sveltekit-sse';
import cycle from 'cycle';
import { onClientUpdate } from '../../../utils/sse-utils.server.js';

/** @type {import('./$types').RequestHandler} */
export function POST({ request }) {
  const todoId = request.headers.get('todo-id');
  return events({
    request,
    start({ emit }) {
      onClientUpdate((todo) => {
        if (!todo || todo.id !== todoId) return;
        emit('todoUpdate', JSON.stringify(cycle.decycle(todo)));
      });
    },
    timeout: 0,
  });
}
