import cycle from 'cycle';
import { browser } from '$app/environment';
import { Todo } from '../interfaces/Todo';

const ARCHIVED_TODOS_KEY = 'TODO_ARCHIVE';
const TODO_ACTION_HISTORY_KEY = 'TODO_ACTION_HISTORY';

browser && localStorage.setItem(TODO_ACTION_HISTORY_KEY, '[]');

const getStoredCycledTodos = (): Todo[] => {
	return JSON.parse((browser && localStorage.getItem(ARCHIVED_TODOS_KEY)) || '[]').map(
		cycle.retrocycle
	);
};

export const storeTodo = (todo: Todo) => {
	storeAction(todo);
	browser &&
		localStorage?.setItem(
			ARCHIVED_TODOS_KEY,
			JSON.stringify(
				[...getStoredCycledTodos().filter(({ id }) => id !== todo.id), todo].map(cycle.decycle)
			)
		);
};

const storeAction = (todo: Todo) => {
	browser &&
		localStorage.setItem(
			TODO_ACTION_HISTORY_KEY,
			JSON.stringify([...getStoredCycledTodos(), todo].map(cycle.decycle))
		);
};
