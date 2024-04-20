import { browser } from '$app/environment';
import { atom, computed, type ReadableAtom, type WritableAtom } from 'nanostores';
import cycle from 'cycle';
import { Todo } from '../interfaces/Todo';
import { storeTodo } from '../utils/storage-utils';

export const serializeTodo = (todo: Todo) => {
  return JSON.stringify(cycle.decycle(todo));
};

export const deserializeTodo = (serializedTodo?: string) => {
  return serializedTodo && cycle.retrocycle(JSON.parse(serializedTodo));
};

const serializedTodo: WritableAtom<string> = atom();

export const todo: ReadableAtom<Todo | undefined> = computed(serializedTodo, deserializeTodo);

export const updateTodo = (todo: Todo, publishUpdate: boolean = true) => {
  storeTodo(todo);
  viewTodo(todo);
  if (publishUpdate && todo.published) {
    publishTodo(todo);
  }
};

export const viewTodo = (todo: Todo) => {
  serializedTodo.set(serializeTodo(todo));
  browser && window.history.replaceState(null, '', window.location.origin);
};

export const publishTodo = async (todo: Todo): Promise<string> => {
  const id = await (
    await fetch('/api/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cycle.decycle(todo)),
    })
  ).text();
  return id;
};
