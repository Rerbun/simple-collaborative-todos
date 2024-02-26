<script lang="ts">
  import { Todo } from '../interfaces/Todo';
  import { todo as computedTodo, viewTodo } from '../stores/todo';

  viewTodo(computedTodo.get() ?? new Todo());
</script>
