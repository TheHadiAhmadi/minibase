<script>
  import { alertMessage } from "$stores/alert";
  import "@ubeac/svelte/styles.css";
  import "virtual:windi.css";
  import "../styles.css";

  let dark = false;
</script>

<div class="h-full" class:dark>
  <div class="h-full font-roboto bg-gray-100 dark:bg-[#303030]">
    <!-- <button
      class="absolute p-2 bottom-2 right-2 z-10 dark:bg-gray-800 dark:text-white bg-gray-100"
      on:click={() => (dark = !dark)}>Toggle Theme</button
    > -->
    <slot />
  </div>
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
  <!-- <Alert color="danger">TODOOOO test dark mode of alert</Alert> -->
</div>

<style>
  .font-roboto {
    font-family: Roboto, sans-serif;
  }
</style>
