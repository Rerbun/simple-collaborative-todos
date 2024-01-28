<script lang="ts">
	import Todo from '../components/Todo.svelte';
	import { Todo as TodoClass } from '../interfaces/Todo';
	/** @type {import('./$types').PageData} */
	export let data;

	export let todo: TodoClass = data.todo;
</script>

<div class="container mx-auto px-32 py-8">
	<Todo {todo}></Todo>
</div>
