<script lang="ts">
	import '../app.css';
	import Todo from '../components/Todo.svelte';
	import { Todo as TodoInstance } from '../interfaces/Todo';
	import { getArchivedTodos, getLastTodo } from '../utils/storage-utils';
	import { todo as computedTodo, viewTodo } from '../stores/todo';
	import { storeTodo } from '../utils/storage-utils';

	let todoInstance: TodoInstance;
	let previousTodo: TodoInstance;
	let nextTodos: TodoInstance[] = [];

	computedTodo.listen((value) => {
		todoInstance = value;
		const archivedTodos = getArchivedTodos();

		const currentIndex = archivedTodos.findIndex((todo) => todo.id === todoInstance.id);
		if (currentIndex > -1) {
			previousTodo = archivedTodos[currentIndex - 1];
		} else {
			previousTodo = archivedTodos.at(-1);
		}
	});

	function archive(todo: TodoInstance) {
		storeTodo(todo);
		viewTodo(new TodoInstance());
	}

	function openPrevious() {
		nextTodos = [todoInstance, ...nextTodos];
		viewTodo(previousTodo);
	}

	function openNext() {
		let nextTodo: TodoInstance;
		[nextTodo, ...nextTodos] = nextTodos;
		viewTodo(nextTodo);
	}
</script>

<slot />

<div class="container mx-auto px-2 py-2 md:px-32 md:py-8">
	{#if previousTodo}
		<button
			name="previous"
			on:click={openPrevious}
			class="h-10 w-10 px-2 bg-white border border-gray hover:border-gray-400 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="gray"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
				/>
			</svg>
		</button>
	{/if}
	<button
		name="archive"
		on:click={() => archive(todoInstance)}
		class="h-10 w-10 px-2 bg-white border border-gray hover:border-gray-400 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
		><svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="gray"
			class="w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
			/>
		</svg>
	</button>
	{#if nextTodos.length}
		<button
			name="next"
			on:click={openNext}
			class="h-10 w-10 px-2 bg-white border border-gray hover:border-gray-400 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="gray"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
				/>
			</svg>
		</button>
	{/if}
	<hr class="my-4" />
	<Todo todo={todoInstance ?? new TodoInstance()}></Todo>
</div>
