<script lang="ts">
  export let backdrop: boolean = false;
</script>

<AppBody
  on:click
  class="absolute bottom-0 right-0 overflow-hidden !top-60px !sm:left-240px"
>
  <div
    class="absolute transition pointer-events-none duration-400 z-1 w-100 h-100 bg-black/20"
    class:opacity-0={!backdrop}
  />

  <div
    class="overflow-hidden h-100 transform transition origin-right duration-400"
    class:scale-95={backdrop}
    class:translate-x-6={backdrop}
  >
    <Card class="h-full overflow-hidden">
      <slot />
    </Card>
  </div>
</AppBody>
