<script lang="ts">
  import ApiKeyValue from "$components/ApiKeyValue.svelte";
  import api from "$services/api";

  import type { Project } from "src/types";
  import { onMount } from "svelte";

  let apiKey = "";

  let projects: Project[] = [];

  let createProjectModalOpen = false;

  let newProject: string = "";

  let copied = false;
  function openCreateProject() {
    createProjectModalOpen = true;
  }

  function closeCreateProject() {
    createProjectModalOpen = false;
    newProject = "";
  }
  async function createProjectSubmit() {
    const project = await api.createProject(newProject);

    apiKey = project.apiKeys?.[0].value ?? "";
    projects = [...projects, project];
  }

  onMount(async () => {
    projects = await api.getProjects();
  });
</script>

<div class="h-full w-full p-2 bg-gradient-to-tl from-blue-50 to-cyan-100">
  <div
    class="container flex flex-col rounded bg-gradient-to-b from-blue-500/10 to-transparent "
  >
    <div class="p-4 flex w-full items-center justify-between">
      <p class="font-bold text-lg">All Projects</p>
      <Button color="primary" on:click={openCreateProject}
        >Create Project</Button
      >
    </div>
    <ul class="flex flex-col px-4 border-t border-blue-100">
      {#each projects as project}
        <li class="p-2"><a href="./{project.name}">{project.name}</a></li>
      {/each}
    </ul>
  </div>
</div>

<Dialog placement="center" bind:open={createProjectModalOpen}>
  <DialogContent>
    {#if apiKey === ""}
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <Row align="end">
          <FormInput
            cols="12"
            bind:value={newProject}
            label="name"
            placeholder="Enter Project's name"
          />
        </Row>
        <Alert>Hello</Alert>
      </DialogBody>
      <DialogFooter>
        <Button on:click={closeCreateProject}>Cancel</Button>
        <Button color="primary" on:click={createProjectSubmit}>Next</Button>
      </DialogFooter>
    {:else}
      <DialogHeader>
        <DialogTitle>Here is ApiKey for "{newProject}"</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <ApiKeyValue value={apiKey} />
      </DialogBody>
      <DialogFooter>
        <Button color="primary" href="/{projects[projects.length - 1].name}">
          Done
        </Button>
      </DialogFooter>
    {/if}
  </DialogContent>
</Dialog>

<!-- kjjk:  mb_dU8Jl_uIoBixcGY4jFPQejwcVRZmn1g3 -->
