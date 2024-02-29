<script lang="ts">
  import { browser } from '$app/environment';
  import { Todo } from '../../../interfaces/Todo';
  import { updateTodo } from '../../../stores/todo';

  browser && history.replaceState(null, '', window.location.origin);

  /** @type {import('./$types').PageData} */
  export let data;

  let todo: Todo;
  todo ??= Todo.fromObject(data.todo ?? new Todo());
  todo && updateTodo(todo);
</script>
