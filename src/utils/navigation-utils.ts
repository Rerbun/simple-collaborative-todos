import { Todo } from '../interfaces/Todo';
import { serializeTodo } from '../stores/todo';

export const generateUrl = (todo: Todo) => {
  return `${location.origin}/share/${encodeURIComponent(btoa(serializeTodo(todo)))}`;
};

export const share = (todo: Todo) => {
  window.navigator.clipboard.writeText(generateUrl(todo));
};
