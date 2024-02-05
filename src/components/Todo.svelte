<script lang="ts">
	import { Todo } from '../interfaces/Todo';
	import { todo as computedTodo, serializeTodo, updateTodo } from '../stores/todo';
	import { storeTodo } from '../utils/storage-utils';

	let todo: Todo;
	computedTodo.subscribe((value) => (todo = value));

	function generateUrl(todo: Todo) {
		return `${location.origin}/share/${encodeURIComponent(btoa(serializeTodo(todo)))}`;
	}

	function share(todo: Todo) {
		window.navigator.clipboard.writeText(generateUrl(todo));
	}

	function archive(todo: Todo) {
		storeTodo(todo);
		viewTodo(new Todo());
	}

	function handleCheck(event: Event, touchedTodo: Todo) {
		touchedTodo.status = (event.target as HTMLInputElement).checked ? 'checked' : 'unchecked';
		updateTodo(todo);
	}

	function viewTodo(todo?: Todo) {
		todo && (window.location.href = generateUrl(todo));
	}

	function handleChildSubmit(event, parent: Todo = todo) {
		const newTodo = new Todo((new FormData(event.target).get('new-todo') as string) ?? '');

		newTodo.parent = parent;
		parent.children.push(newTodo);
		updateTodo(todo);

		event.target.reset();
	}
</script>

<div class="flex gap-2 flex-col">
	<div class="flex gap-2 items-center">
		{#if todo.parent}
			<button
				name="open-parent"
				on:click={() => todo.parent && viewTodo(todo.parent)}
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
						d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
					/>
				</svg>
			</button>
		{/if}
		{#if todo.title}
			<h1 class="text-xl font-medium">{todo.title}</h1>
		{/if}
		<button
			name="share"
			on:click={() => share(todo)}
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
					d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
				/>
			</svg>
		</button>
		<button
			name="archive"
			on:click={() => archive(todo)}
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
	</div>

	{#each todo.children as child, index}
		<div
			class="flex gap-1 w-full pl-2 justify-between items-center border rounded hover:border-gray-400"
		>
			<div class="flex gap-2">
				<input
					type="checkbox"
					name="checkbox-{index}"
					id="checkbox-{index}"
					checked={child.status === 'checked'}
					on:change={(event) => handleCheck(event, child)}
				/>
				<label for="checkbox-{index}">{child.title}</label>
			</div>
			<div class="flex gap-1">
				<button
					name="view"
					on:click={() => {
						viewTodo(child);
					}}
					class="h-10 w-10 px-2 bg-white border border-gray hover:border-gray-400 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
						/>
					</svg>
				</button>
				<!-- <button
					name="open"
					class="h-10 w-10 px-2 bg-white border border-gray hover:border-gray-400 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="gray"
						class="w-6 h-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
					</svg>
				</button> -->
			</div>
		</div>
	{/each}
	<form on:submit|preventDefault={(event) => handleChildSubmit(event)} class="flex gap-1">
		<input
			type="text"
			name="new-todo"
			placeholder="New to-do"
			class="h-10 shadow appearance-none border border-gray hover:border-gray-400 rounded w-full py-2 px-2 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
		/>
		<button
			type="submit"
			name="add-todo"
			class="h-10 px-2 bg-white border border-gray hover:border-gray-400 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="gray"
				class="w-6 h-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>
		</button>
	</form>
</div>
