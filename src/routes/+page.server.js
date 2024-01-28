import { error, redirect } from '@sveltejs/kit';
/** @type {import('./$types').PageServerLoad} */
export function load({ cookies }) {
	let todo;
	try {
		todo = JSON.parse(atob(decodeURIComponent(cookies.get('todo'))));
		console.log('Loaded todo: ', todo);
        
	} catch (e) {
		console.error(e);
		error(400, { message: 'Incorrect URL' });
	}

    return {
        todo,
    }
}
