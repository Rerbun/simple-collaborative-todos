import { browser } from '$app/environment';
import { atom, computed, type ReadableAtom, type WritableAtom } from 'nanostores';
import cycle from 'cycle';
import { source } from 'sveltekit-sse';
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

source('/api/events')
  .select('todoUpdate')
  .subscribe((todoString) => {
    const updatedTodo = deserializeTodo(todoString);
    const currentTodo = todo.get();
    if (currentTodo && currentTodo.id === updatedTodo.id) {
      console.log(updatedTodo.children.map((child) => child.title));
      updateTodo(Todo.fromObject(updatedTodo), false);
    }
  });

export const updateTodo = async (todo: Todo, publishUpdate: boolean = true) => {
  storeTodo(todo);
  if (publishUpdate && todo.published) {
    await publishTodo(todo);
  }
  viewTodo(todo);
};

export const viewTodo = async (todo: Todo) => {
  let unserializedTodo = browser && todo.published ? await fetchTodoById(todo.id) : todo;
  serializedTodo.set(serializeTodo(unserializedTodo));
  console.log(unserializedTodo.children.map((child) => child.title));
  browser && window.history.replaceState(null, '', window.location.origin);
};

export const publishTodo = async (todo: Todo): Promise<string> => {
  const id = await (
    await fetch('/api/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cycle.decycle(todo)),
    })
  ).text();
  return id;
};

export const fetchTodoById = async (id: string): Promise<Todo> => {
  const todo = cycle.retrocycle(
    await (
      await fetch(`/api/todo/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json()
  );
  todo.published = true;
  return Todo.fromObject(todo);
};
