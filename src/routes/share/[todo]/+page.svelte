<script lang="ts">
	import { browser } from '$app/environment';
	import { Todo } from '../../../interfaces/Todo';
	import { updateTodo } from '../../../stores/todo';
	import { getLastTodo } from '../../../utils/storage-utils';

	browser && history.replaceState(null, '', window.location.origin);

	/** @type {import('./$types').PageData} */
	export let data;

	let todo: Todo;
	todo ??= Todo.fromObject(data.todo ?? getLastTodo());
	todo && updateTodo(todo);
</script>
