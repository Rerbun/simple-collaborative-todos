import { Todo } from '../interfaces/Todo';
import { serializeTodo } from '../stores/todo';

export function generateUrl(todo: Todo) {
	return `${location.origin}/share/${encodeURIComponent(btoa(serializeTodo(todo)))}`;
}

export function share(todo: Todo) {
	window.navigator.clipboard.writeText(generateUrl(todo));
}
