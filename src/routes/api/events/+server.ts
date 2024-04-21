import { events } from 'sveltekit-sse';
import cycle from 'cycle';
import { publishedTodo } from '../../../stores/collaboration.server.js';

/** @type {import('./$types').RequestHandler} */
export function POST({ request }) {
  return events({
    request,
    async start({ emit }) {
      publishedTodo.subscribe((todo) => {
        console.log(todo.children.map((child) => child.title));
        emit('todoUpdate', JSON.stringify(cycle.decycle(todo)));
      });
    },
  });
}
