import { events } from 'sveltekit-sse';
import cycle from 'cycle';
import { onClientUpdate } from '../../../utils/sse-utils.server.js';
// import {
//   todoEventHandler as todoEventHandler,
//   todoToPublish,
// } from '../../../stores/collaboration.server.js';

/** @type {import('./$types').RequestHandler} */
export function POST({ request }) {
  return events({
    request,
    async start({ emit }) {
      onClientUpdate((todo) => {
        if (!todo) return;
        emit('todoUpdate', JSON.stringify(cycle.decycle(todo)));
      });
    },
  });
}
