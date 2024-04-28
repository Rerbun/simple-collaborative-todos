import { EventEmitter } from 'events';
import type { Todo } from '../interfaces/Todo';

const eventEmitter = new EventEmitter();

export const sendToClients = (todo: Todo) => {
  eventEmitter.emit('sendToClients', todo);
};

export const onClientUpdate = (callback: (todo: Todo) => void) => {
  eventEmitter.on('sendToClients', (todo) => {
    callback(todo);
    eventEmitter.emit('notifyUpdateSent');
  });
};

export const onUpdateSent = (callback: (value: unknown) => void, once = false) => {
  eventEmitter[once ? 'once' : 'on']('notifyUpdateSent', callback);
};
