import { error, redirect } from '@sveltejs/kit';
/** @type {import('./$types').PageServerLoad} */
export function load({ params, cookies, url }) {
	try {
		cookies.set('todo', params.todo, { path: '/' });
		// http://localhost:5173/share/eyJjaGlsZHJlbiI6W3siY2hpbGRyZW4iOltdLCJzdGF0dXMiOiJjaGVja2VkIiwidGl0bGUiOiJUZXN0IDEifSx7ImNoaWxkcmVuIjpbXSwic3RhdHVzIjoidW5jaGVja2VkIiwidGl0bGUiOiJUZXN0IDIifV0sInN0YXR1cyI6ImNoZWNrZWQiLCJ0aXRsZSI6Ik1haW4gdG9kbyJ9
	} catch (e) {
		console.error(e);
		error(400, { message: 'Incorrect URL' });
	}
	throw redirect(302, url.origin);
}
