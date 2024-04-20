<script lang="ts">
  import cycle from 'cycle';
  import { Todo } from '../../../interfaces/Todo';
  import { updateTodo } from '../../../stores/todo';

  /** @type {import('./$types').PageData} */
  export let data;

  let todo: Todo;
  todo ??= Todo.fromObject(data ?? new Todo());
  todo && updateTodo(todo);
</script>
