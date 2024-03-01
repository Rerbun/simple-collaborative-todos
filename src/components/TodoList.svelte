<script lang="ts">
  import { Todo } from '../interfaces/Todo';
  import { updateTodo, viewTodo } from '../stores/todo';
  import { share } from '../utils/navigation-utils';
  import StyledButton from './StyledButton.svelte';
  import StyledVectorGraphic from './StyledVectorGraphic.svelte';

  export let todo: Todo;

  const handleCheck = (event: Event, touchedTodo: Todo) => {
    touchedTodo.status = (event.target as HTMLInputElement).checked ? 'checked' : 'unchecked';
    updateTodo(todo);
  };

  const handleChildSubmit = (event, parent: Todo = todo) => {
    const newTodo = new Todo((new FormData(event.target).get('new-todo') as string) ?? '');

    newTodo.parent = parent;
    parent.children.push(newTodo);
    updateTodo(todo);

    event.target.reset();
  };

  const handleChildRemoveByIndex = (index: number) => {
    todo.children.splice(index, 1);
    updateTodo(todo);
  };
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center gap-2">
    <StyledButton name="share" on:click={() => share(todo)}
      ><StyledVectorGraphic>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
        />
      </StyledVectorGraphic>
    </StyledButton>
    {#if todo.parent}
      <StyledButton name="open-parent" on:click={() => todo.parent && viewTodo(todo.parent)}
        ><StyledVectorGraphic>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
          />
        </StyledVectorGraphic>
      </StyledButton>
    {/if}
    {#if todo.title}
      <h1 class="text-xl font-medium">{todo.title}</h1>
    {/if}
  </div>

  {#each todo.children as child, index}
    <div
      class="flex items-center justify-between w-full gap-1 py-1 pl-2 pr-1 border rounded hover:border-gray-400 dark:border-gray-500 dark:hover:border-gray-400"
    >
      <div class="flex gap-2">
        <input
          type="checkbox"
          name="checkbox-{index}"
          id="checkbox-{index}"
          checked={child.status === 'checked'}
          class="dark:accent-gray-500 dark:bg-gray-500 dark:text-gray-500"
          on:change={(event) => handleCheck(event, child)}
        />
        <label for="checkbox-{index}">{child.title}</label>
      </div>
      <div class="flex gap-1">
        <StyledButton
          name="view"
          on:click={() => {
            viewTodo(child);
          }}
        >
          {#if !child.children.length}
            <StyledVectorGraphic>
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
            </StyledVectorGraphic>
          {:else}
            <span
              >{child.children.reduce(
                (numberOfCompleted, child) =>
                  numberOfCompleted + Number(child.status !== 'unchecked'),
                0
              )}/{child.children.length}</span
            >
          {/if}
        </StyledButton>
        <StyledButton
          name="remove"
          on:click={() => {
            handleChildRemoveByIndex(index);
          }}
          ><StyledVectorGraphic>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </StyledVectorGraphic>
        </StyledButton>
      </div>
    </div>
  {/each}
  <form on:submit|preventDefault={(event) => handleChildSubmit(event)} class="flex gap-1">
    <input
      type="text"
      name="new-todo"
      placeholder="New to-do"
      class="w-full h-10 px-2 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none border-gray hover:border-gray-400 focus:outline-none focus:shadow-outline dark:bg-neutral-800 dark:border-neutral-500 dark:text-gray-200 dark:placeholder:text-gray-400"
    />
    <StyledButton type="submit" name="add-todo"
      ><StyledVectorGraphic>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </StyledVectorGraphic>
    </StyledButton>
  </form>
</div>
