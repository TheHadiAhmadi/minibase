<script lang="ts">
  import { goto } from "$app/navigation";
  import MainBody from "$components/MainBody.svelte";
  import ShowSdk from "$components/ShowSdk.svelte";
  import api from "$services/api";
  import type { PageData } from "./$types";

  export let data: PageData;

  async function logout() {
    // await api.setCookie(`apiKey`, "");
    goto("/projects");
  }

  // function openAddEnv() {
  //   // activePage = "add-env";
  //   activeEnv = null;
  //   closeSidebar();
  // }

  // function openEditEnv(key: { key: string; value: string }) {
  //   activePage = "edit-env";
  //   activeEnv = key;
  //   closeSidebar();
  // }

  // function editEnvSubmit({ detail }: CustomEvent) {
  //   // TODO
  //   alertMessage.showInfo("Environment Variable edited successfully");
  //   console.log("edit env", detail);

  //   env = env.map((en) => {
  //     if (en.key === detail.key) return detail;
  //     return en;
  //   });
  // }

  // function addEnvSubmit({ detail }: CustomEvent) {
  //   alertMessage.showInfo("Environment Variable added successfully");

  //   env = [...env, detail];
  //   activePage = "edit-env";
  //   activeEnv = detail;
  // }

  let showSdkModalOpen = false;

  $: console.log(data);
</script>

<MainBody>
  <h1>Welcome to Dashboard</h1>

  <div class="h-200px" />
</MainBody>
<CardFooter>
  <CardActions>
    <ButtonGroup>
      <Button
        color="primary"
        outline
        on:click={() => (showSdkModalOpen = true)}
      >
        Show SDK File
      </Button>
      <Button color="danger" class="w-min ms-auto" on:click={logout}>
        Exit from Project
      </Button>
    </ButtonGroup>
  </CardActions>
</CardFooter>

<Dialog bind:open={showSdkModalOpen} placement="center" persistent size="lg">
  <DialogContent>
    <DialogHeader>
      <DialogTitle>store this file as minibase.js in your project</DialogTitle>
    </DialogHeader>
    <ShowSdk project={data.project} />

    <DialogClose />
  </DialogContent>
</Dialog>
