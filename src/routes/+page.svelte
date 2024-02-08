<script lang="ts">
	import Todo from '../components/Todo.svelte';
	import { Todo as TodoIntance } from '../interfaces/Todo';
	import { updateTodo } from '../stores/todo';
	/** @type {import('./$types').PageData} */
	export let data;

	let todoInstance: TodoIntance;
	todoInstance ??= Object.assign(new TodoIntance(), data.todo);
	updateTodo(todoInstance);
</script>

<div class="container mx-auto px-2 py-2 md:px-32 md:py-8">
	<Todo></Todo>
</div>
