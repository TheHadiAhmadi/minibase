<script lang="ts">
  export let backdrop: boolean = false;
</script>

<AppBody class="overflow-hidden">
  <div
    class="absolute transition pointer-events-none duration-400 z-1 w-100 h-100 bg-black/20"
    class:opacity-0={!backdrop}
  />

  <div class="p-3 overflow-hidden">
    <Card class="max-h-full overflow-hidden">
      <slot name="header" />

      <CardBody class="h-100px overflow-auto flex-1 flex flex-col">
        <slot />
      </CardBody>
      <slot name="footer" />
    </Card>
  </div>
</AppBody>
