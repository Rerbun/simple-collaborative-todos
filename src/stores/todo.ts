import { atom, computed, type ReadableAtom, type WritableAtom } from 'nanostores';
import cycle from 'cycle';
import { Todo } from '../interfaces/Todo';

export const serializeTodo = (todo: Todo) => {
	return JSON.stringify(cycle.decycle(todo));
};

export const deserializeTodo = (serializedTodo: string) => {
	return cycle.retrocycle(JSON.parse(serializedTodo));
};

const serializedTodo: WritableAtom<string> = atom(serializeTodo(new Todo()));

export const todo: ReadableAtom = computed(serializedTodo, deserializeTodo);

export const updateTodo = (todo: Todo) => {
	serializedTodo.set(serializeTodo(todo));
};

// export const forceUpdateStore = action(
// 	todo,
// 	'forceUpdateStore',
// 	(_, updatedTodo: Todo = todo.get()) => {
// 		// Update reference to make sure re-renders are triggered on bindings
// 		todo.set(updatedTodo.clone());

// 		return todo.get();
// 	}
// );
