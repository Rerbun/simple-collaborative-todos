<script lang="ts">
  import { Todo } from '../interfaces/Todo';
  import { todoAtom as computedTodo, viewTodo } from '../stores/todo';
  import { getLastTodo } from '../utils/storage-utils';

  viewTodo(computedTodo.get() ?? getLastTodo() ?? new Todo());
</script>
