<script lang="ts">
	import '../app.css';
	import Todo from '../components/Todo.svelte';
	import { Todo as TodoInstance } from '../interfaces/Todo';
	import { updateTodo } from '../stores/todo';
	import { getLastTodo } from '../utils/storage-utils';

	let todoInstance: TodoInstance;
	todoInstance ??= TodoInstance.fromObject(getLastTodo() ?? {});
	todoInstance && updateTodo(todoInstance);
</script>

<slot />

<div class="container mx-auto px-2 py-2 md:px-32 md:py-8">
	<Todo></Todo>
</div>
