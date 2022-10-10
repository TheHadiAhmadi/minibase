<script>
  export let title = "";
  export let open = false;
</script>

<li
  on:click={() => (open = !open)}
  on:click
  class="flex items-center gap-2 hover:bg-blue-100 p-2 border-b border-gray-100 hover:border-gray-200"
  class:font-bold={$$slots["default"] && open}
>
  <slot name="start" {open}>
    {#if open}
      <Icon pack="ion" name="ios-arrow-down" />
    {:else}
      <Icon pack="ion" name="ios-arrow-right" />
    {/if}
  </slot>
  <p class="w-full">
    {title}
  </p>
  <div on:click|stopPropagation={() => {}}>
    <slot name="end" />
  </div>
</li>
{#if open && $$slots["default"]}
  <div class="pl-4 pb-2">
    <slot />
  </div>
{/if}
