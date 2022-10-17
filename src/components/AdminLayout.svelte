<script lang="ts">
  import { media } from "$stores";
  export let open: boolean = false;
</script>

<App>
  <AppHeader>
    <div
      class="p-2 flex justify-between align-center
               bg-blue-200 border-b border-blue-400 w-full"
    >
      <div class="flex gap-2 items-center justify-start">
        <Button class="border-none sm:hidden" on:click={() => (open = !open)}>
          <Icon pack="ion" name="menu" />
        </Button>
        <a class="font-bold sm:pl-3 text-lg h-full flex items-center" href="/">
          Minibase
        </a>
      </div>

      <div>
        <Avatar shape="circle">AB</Avatar>
      </div>
    </div>
  </AppHeader>

  <AppSidebar
    mode={$media.sm ? "temporary" : "permanent"}
    open={open || !$media.sm}
    class="z-2 flex flex-col bg-blue-50 border-r !top-57px border-blue-400"
  >
    <slot name="sidebar" />
  </AppSidebar>

  <AppBody>
    <slot />
  </AppBody>
</App>
