import { writable, type Writable } from 'svelte/store';
import type { Todo } from '../interfaces/Todo';

export const publishedTodo: Writable<null | Todo> = writable(null);
