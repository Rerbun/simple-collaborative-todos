import { text, error, json } from '@sveltejs/kit';
import cycle from 'cycle';
import { saveTodo, getTodoById } from '../../../../utils/database-utils.server';
import type { Todo } from '../../../../interfaces/Todo';
import { publishedTodo } from '../../../../stores/collaboration.server';

export async function GET({ request, params, url }) {
  let todo: Todo;
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

  return json(cycle.decycle(todo));
}
