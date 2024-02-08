import { error, redirect } from '@sveltejs/kit';
import { deserializeTodo } from '../stores/todo';
/** @type {import('./$types').PageServerLoad} */
export function load({ cookies }) {
	let todo;
	try {
		let todoString = cookies.get('todo');
		if (todoString) {
			todo = deserializeTodo(atob(decodeURIComponent(todoString)));
		}
		console.log('Loaded todo: ', todo);
		cookies.delete('todo', { path: '/' });
	} catch (e) {
		console.error(e);
		error(400, { message: 'Incorrect URL' });
	}

	return {
		todo
	};
}
