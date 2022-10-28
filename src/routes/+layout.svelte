<script>
  import { alertMessage } from "$stores/alert";
  import "@ubeac/svelte/styles.css";
  import "virtual:windi.css";
</script>

<div class="h-full font-roboto">
  <slot />
</div>

<div
  class="absolute z-2 bottom-4 right-4 left-4 min-w-300px sm:right-auto alert-container"
>
  {#each $alertMessage as alert}
    {@const color = alert.type === "error" ? "danger" : alert.type}
    <Alert {color}>
      {alert.message}
    </Alert>
  {/each}
</div>

<style>
  .font-roboto {
    font-family: Roboto, sans-serif;
  }
</style>
