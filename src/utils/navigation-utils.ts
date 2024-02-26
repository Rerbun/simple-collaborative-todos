import { Todo } from '../interfaces/Todo';
import { serializeTodo } from '../stores/todo';

export const generateUrl = (todo: Todo) => {
  return `${location.origin}/share/${encodeURIComponent(btoa(serializeTodo(todo)))}`;
};

export const share = (todo: Todo) => {
  const url = generateUrl(todo);
  const shareObject = {
    title: 'Copy of my to-do list',
    url,
  };
  navigator.canShare(shareObject)
    ? navigator.share(shareObject)
    : navigator.clipboard.writeText(url);
};
