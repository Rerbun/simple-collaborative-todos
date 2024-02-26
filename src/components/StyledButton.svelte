<!-- TODO: replace specified event listener and $$props with svelte 5 modifier for bubbling events: https://svelte-5-preview.vercel.app/docs/event-handlers#bubbling-events & https://github.com/sveltejs/svelte/issues/2837 -->
<button
  on:click
  {...$$props}
  class="w-10 h-10 px-2 leading-tight bg-white border rounded shadow border-gray hover:border-gray-400 focus:outline-none focus:shadow-outline"
>
  <slot />
</button>
