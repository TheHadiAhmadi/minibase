<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let title = "";
  export let open = false;

  export let disabled = false;

  let className = "";
  export { className as class };

  const dispatch = createEventDispatcher();

  function click() {
    if (!disabled) {
      open = !open;
      dispatch("click");
    }
  }
</script>

<li
  on:click={click}
  class="flex cursor-default items-center gap-2 hover:bg-blue-100 p-2 border-b border-gray-100 dark:border-[#505050] dark:bg-[#404040] dark:text-gray-200 hover:border-gray-200 {className}"
  class:font-bold={$$slots["content"] && open}
  class:text-gray-500={disabled}
>
  <slot>
    <slot name="start" {open}>
      {#if open}
        <Icon pack="mdi" name="chevron-down" />
      {:else}
        <Icon pack="mdi" name="chevron-right" />
      {/if}
    </slot>

    <slot name="title">
      <span class="flex-1">{title}</span>
    </slot>
    <!-- <p
    class="flex items-center w-full"
    on:dblclick={() => (editable ? (renaming = true) : (renaming = false))}
  >
    {#if renaming}
      <input
        size="4"
        class="w-full outline-none border border-gray-200 bg-gray-100 p-0.5 mr-1"
        placeholder="Enter a name..."
        on:keydown={(e) => {
          if (e.key === "Enter") {
            rename();
          }
        }}
        bind:value={title}
      />
      <Button color="success" on:click={() => rename()} size="sm">
        <Icon pack="mdi" name="check" />
      </Button>
    {:else}
      <span>{title}</span>
    {/if}
  </p> -->
    <div on:click|stopPropagation={() => {}}>
      <slot name="end" />
    </div>
  </slot>
</li>
{#if open && $$slots["content"]}
  <div class="pl-4">
    <slot name="content" />
  </div>
{/if}
