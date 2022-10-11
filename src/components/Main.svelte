<script lang="ts">
  export let backdrop: boolean = false;
</script>

<AppBody class="overflow-hidden">
  <div
    class="absolute transition pointer-events-none duration-400 z-1 w-100 h-100 bg-black/20"
    class:opacity-0={!backdrop}
  />

  <div
    class="p-3 overflow-hidden h-100 transform transition origin-right duration-400"
    class:scale-95={backdrop}
    class:translate-x-6={backdrop}
  >
    <Card class="max-h-full overflow-hidden">
      <slot />
    </Card>
  </div>
</AppBody>
