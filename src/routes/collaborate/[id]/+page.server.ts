import { error } from '@sveltejs/kit';
import { getTodoById } from '../../../utils/database-utils.server';
/** @type {import('./$types').PageServerLoad} */

export const load = async ({ params }) => {
  let todo;
  try {
    if (params.id) {
      todo = await getTodoById(params.id);
    }
    console.log('Retrieved todo: ', todo);
    if (!todo) error(404, { message: 'To-do not found' });
  } catch (e) {
    console.error(e);
    error(400, { message: 'Could not load to-do' });
  }

  return {
    todo,
  };
};
