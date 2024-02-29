<script lang="ts">
  import { Todo } from '../interfaces/Todo';
  import { todo as computedTodo, viewTodo } from '../stores/todo';
  import { getLastTodo } from '../utils/storage-utils';

  viewTodo(computedTodo.get() ?? getLastTodo() ?? new Todo());
</script>
