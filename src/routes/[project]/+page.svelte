<script lang="ts">
  import { goto } from "$app/navigation";
  import MainBody from "$components/MainBody.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  async function logout() {
    await fetch("/api/set-cookie", {
      method: "POST",
      body: JSON.stringify({
        name: `${data.project.name}-apikey`,
        value: "",
      }),
    });
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
</script>

<MainBody>
  <h1>Welcome to Dashboard</h1>
  <div class="h-200px" />

  <Button color="danger" class="w-min ms-auto" on:click={logout}
    >Exit from Project</Button
  >
</MainBody>
