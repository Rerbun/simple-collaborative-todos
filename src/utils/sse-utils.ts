import { source } from 'sveltekit-sse';

let todoId: string = null;
let subscription: ReturnType<typeof source> = null;

export const initSSE = (publishId: string, callback: (todoString: string) => void) => {
  if (todoId === publishId) {
    return;
  }

  subscription?.close();

  subscription = source('/api/events', {
    options: {
      headers: { 'todo-id': publishId },
      timeout: undefined,
    },
  });

  subscription.select('todoUpdate').subscribe(callback);

  todoId = publishId;
};
