<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import TodoList from '../components/TodoList.svelte';
  import { Todo } from '../interfaces/Todo';
  import { getArchivedTodos, removeFromArchive } from '../utils/storage-utils';
  import { todo as computedTodo, viewTodo } from '../stores/todo';
  import StyledVectorGraphic from '../components/StyledVectorGraphic.svelte';
  import StyledButton from '../components/StyledButton.svelte';

  let todoInstance: Todo;
  let previousTodo: Todo;
  let nextTodos: Todo[] = [];

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

  const openPrevious = () => {
    nextTodos = [todoInstance, ...nextTodos];
    viewTodo(previousTodo);
  };

  const openNext = () => {
    let nextTodo: Todo;
    [nextTodo, ...nextTodos] = nextTodos;
    viewTodo(nextTodo);
  };

  const openNew = () => {
    viewTodo(new Todo());
  };

  const remove = (todo: Todo) => {
    removeFromArchive(todo);
    const [nextTodo] = nextTodos;
    viewTodo(previousTodo ?? nextTodo ?? new Todo());
  };
</script>

<div class="container px-4 py-4 mx-auto md:px-32 md:py-8">
  <slot />
  {#if !$page.url.pathname.includes('/info')}
    <div class="grid w-full grid-cols-3">
      <div>
        {#if previousTodo}
          <StyledButton name="previous" on:click={openPrevious}
            ><StyledVectorGraphic>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
              />
            </StyledVectorGraphic>
          </StyledButton>
        {/if}
      </div>
      <div class="flex justify-center gap-1">
        <StyledButton name="remove" on:click={() => remove(todoInstance)}
          ><StyledVectorGraphic>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </StyledVectorGraphic>
        </StyledButton>
        <a href="/info">
          <StyledButton name="info"
            ><StyledVectorGraphic>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </StyledVectorGraphic>
          </StyledButton>
        </a>
      </div>
      <div class="flex justify-end gap-1">
        {#if nextTodos.length}
          <StyledButton name="next" on:click={openNext}
            ><StyledVectorGraphic>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </StyledVectorGraphic>
          </StyledButton>
        {:else}
          <StyledButton name="next" on:click={openNew}
            ><StyledVectorGraphic>
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </StyledVectorGraphic>
          </StyledButton>
        {/if}
      </div>
    </div>
    <hr class="my-4 bg-gray-500 dark:bg-gray-300" />
    <TodoList todo={todoInstance ?? new Todo()}></TodoList>
  {/if}
</div>
