<script lang="ts">
  import { Todo } from '../../../interfaces/Todo';
  import { updateTodo } from '../../../stores/todo';

  /** @type {import('./$types').PageData} */
  export let data;

  let todo: Todo;
  todo ??= Todo.fromObject(data.todo ?? new Todo());
  todo && updateTodo(todo);
</script>
