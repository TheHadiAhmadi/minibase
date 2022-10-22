<script lang="ts">
  import { media, activeProject } from "$stores";
  import { page } from "$app/stores";
  import { getProject } from "$services/api";
  import { alertMessage } from "$stores/alert";
  import FunctionSideMenu from "$components/FunctionSideMenu.svelte";
  import type { LayoutData } from "./$types";
  import { onMount } from "svelte";
  import { goto, invalidate, invalidateAll } from "$app/navigation";
  import Main from "$components/Main.svelte";
  import CollectionSideMenu from "$components/CollectionSideMenu.svelte";
  import { browser } from "$app/environment";
  import SettingsSideMenu from "$components/SettingsSideMenu.svelte";
  import HomeSideMenu from "$components/HomeSideMenu.svelte";

  export let data: LayoutData;

  let errorMessage: string = "";

  let loading = false;

  let apiKey = data.apiKey ?? "";

  async function onContinue() {
    const result = await fetch("/api/set-cookie", {
      method: "POST",
      body: JSON.stringify({
        name: $page.params.project + "-apikey",
        value: apiKey,
      }),
    });
    invalidateAll();
  }

  let open = false;
</script>

{#if data.project}
  <App>
    <AppHeader class="!h-60px">
      <div
        class="p-2 flex justify-between align-center
               bg-blue-200 border-b border-blue-400 w-full"
      >
        <div class="flex gap-2 items-center justify-start">
          <Button class="border-none sm:hidden" on:click={() => (open = !open)}>
            <Icon pack="ion" name="menu" />
          </Button>
          <a
            class="font-bold sm:pl-3 text-lg h-full flex items-center"
            href="/"
          >
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
      class="z-2 flex flex-col bg-blue-50 border-r w-240px !top-60px border-blue-400"
    >
      <HomeSideMenu />
      <FunctionSideMenu />
      <CollectionSideMenu />
      <!-- <EnvSideMenu />-->
      <SettingsSideMenu />
    </AppSidebar>

    <Main on:click={() => (open = false)} backdrop={open && !media.sm}>
      <slot />
    </Main>
  </App>
{/if}

<Dialog persistent placement="center" open={!data.project}>
  <DialogContent>
    <DialogBody>
      <FormInput
        name="apiKey"
        label="Enter Project's ApiKey"
        bind:value={apiKey}
      />
      {#if errorMessage}
        <Alert type="danger">
          {errorMessage}
        </Alert>
      {/if}
    </DialogBody>
    <DialogFooter>
      <Button href="/projects">Back</Button>
      <Button on:click={onContinue} color="primary">Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
