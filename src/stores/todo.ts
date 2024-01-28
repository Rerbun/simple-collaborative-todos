import { action, atom, type WritableAtom } from 'nanostores';
import { Todo } from '../interfaces/Todo';

export const todo: WritableAtom<Todo> = atom(new Todo());

export const addChild = action(todo, 'addChild', (todoAtom, newChildTitle: string) => {
	const newChild = new Todo(newChildTitle);
	newChild.parent = todoAtom.get();
	newChild.parent.children.push(newChild);

	todoAtom.set(newChild.parent);

	return todoAtom.get();
});
