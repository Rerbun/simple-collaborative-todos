import cycle from 'cycle';
import { browser } from '$app/environment';
import { Todo } from '../interfaces/Todo';

const ARCHIVED_TODOS_KEY = 'TODO_ARCHIVE';
const TODO_ACTION_HISTORY_KEY = 'TODO_ACTION_HISTORY';

browser && localStorage.setItem(TODO_ACTION_HISTORY_KEY, '[]');

export const getArchivedTodos = (): Todo[] => {
  return JSON.parse((browser && localStorage.getItem(ARCHIVED_TODOS_KEY)) || '[]').map(
    (todo: Record<string, any>) => Todo.fromObject(cycle.retrocycle(todo))
  );
};

export const getLastTodo = (): Todo | undefined => {
  return getArchivedTodos().at(-1);
};

export const storeTodo = (todo: Todo) => {
  const apicalParent = todo.getApicalParent();
  storeAction(apicalParent);
  spliceArchice(apicalParent);
};

export const removeFromArchive = (todo: Todo) => {
  spliceArchice(todo.getApicalParent(), true);
};

const spliceArchice = (todo: Todo | Record<string, any>, remove = false) => {
  let archivedTodos: Todo[] | Record<string, any>[] = getArchivedTodos();

  const todoIndex = archivedTodos.findIndex(({ id }) => todo.id === id);
  // Splice only adds to end if -array.length <= start < 0, so manually add it to the end of the array if index === -1
  archivedTodos =
    todoIndex > -1
      ? archivedTodos.toSpliced(todoIndex, 1, ...(remove ? [] : [todo]))
      : [...archivedTodos, todo];

  browser &&
    localStorage?.setItem(ARCHIVED_TODOS_KEY, JSON.stringify(archivedTodos.map(cycle.decycle)));
};

const storeAction = (todo: Todo | Record<string, any>) => {
  browser &&
    localStorage.setItem(
      TODO_ACTION_HISTORY_KEY,
      JSON.stringify(
        [
          JSON.parse((browser && localStorage.getItem(TODO_ACTION_HISTORY_KEY)) || '[]').map(
            cycle.retrocycle
          ),
          todo,
        ].map(cycle.decycle)
      )
    );
};
