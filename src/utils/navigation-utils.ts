import { Todo } from '../interfaces/Todo';
import { serializeTodo } from '../stores/todo';

export const generateUrl = (todo: Todo) => {
  return `${location.origin}/share/${encodeURIComponent(btoa(serializeTodo(todo)))}`;
};

export const shareLink = (todo: Todo) => {
  if (todo.published) return shareCollaborateLink(todo.id);
  const url = generateUrl(todo);
  const shareObject = {
    title: 'Copy of my to-do list',
    url,
  };
  navigator.canShare(shareObject)
    ? navigator.share(shareObject)
    : navigator.clipboard.writeText(url);
};

export const shareCollaborateLink = (todoId: string) => {
  const url = `${window.location.origin}/collaborate/${todoId}`;
  const shareObject = {
    title: 'Collaborate on my to-do list',
    url,
  };
  navigator.canShare(shareObject)
    ? navigator.share(shareObject)
    : navigator.clipboard.writeText(url);
};
