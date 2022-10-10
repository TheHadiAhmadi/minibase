<script lang="ts">
  import CollectionEditor from "$components/CollectionEditor.svelte";
  import FunctionEditor from "$components/FunctionEditor.svelte";
  import { media, activeProject } from "$stores";
  import { page } from "$app/stores";

  import type { ProjectCollection, ProjectFunction } from "src/types";
  import {
    getProject,
    removeCollection,
    removeFunction,
    updateProject,
  } from "$services/api";
  import Main from "$components/Main.svelte";
  import { alertMessage } from "$stores/alert";
  import EnvEditor from "$components/EnvEditor.svelte";

  let collections: ProjectCollection[] = [];
  let functions: ProjectFunction[] = [];

  let activeFunction: ProjectFunction | null = null;
  let activeEnv: string | null = null;
  let activeCollection: ProjectCollection | null = null;

  let hasAccess = false;
  let apiKey = "";

  let activePage:
    | "edit-collection"
    | "add-collection"
    | "edit-function"
    | "add-function"
    | "edit-env"
    | "add-env"
    | "default" = "default";

  function openAddCollection() {
    activePage = "add-collection";
    closeSidebar();
  }
  function openAddFunction() {
    activePage = "add-function";
    closeSidebar();
  }
  function openAddEnv() {
    activePage = "add-env";
    // activeEnv = "";
    closeSidebar();
  }

  function openEditCollection(collection: ProjectCollection) {
    activePage = "edit-collection";
    activeCollection = collection;
    closeSidebar();
  }
  function openEditFunction(fn: ProjectFunction) {
    activePage = "edit-function";
    activeFunction = fn;
    closeSidebar();
  }
  function openEditEnv(key: string) {
    activePage = "edit-env";
    activeEnv = key;
    closeSidebar();
  }

  function addFunctionSubmit({ detail }: CustomEvent) {
    functions = [...functions, detail as ProjectFunction];
    activeFunction = functions[functions.length - 1];
    activePage = "edit-function";
  }

  function editFunctionSubmit({ detail }: CustomEvent) {
    // TODO
    alertMessage.showInfo("Function edited successfully");
    console.log("edit function", detail);
    functions = functions.map((fn) => {
      if (fn.id === detail.id) return detail;
      return fn;
    });
  }

  function editEnvSubmit({ detail }: CustomEvent) {
    // TODO
    alertMessage.showInfo("Environment Variable edited successfully");
    console.log("edit env", detail);
    $activeProject.env[detail.key] = detail.value;
  }

  async function openRemoveFunction(fn: ProjectFunction) {
    try {
      const response: boolean = await removeFunction(project, fn.id!, apiKey);

      alertMessage.showInfo("Function removed successfully");
      functions = functions.filter((fnc) => fnc.id !== fn.id);
      if (activeFunction === fn) {
        activeFunction = null;
        activePage = "default";
      }
    } catch (err) {
      //
    }
  }

  async function openRemoveCollection(collection: ProjectCollection) {
    try {
      const response = await removeCollection(project, collection.name, apiKey);
      alertMessage.showInfo("Collection removed successfullly");
      collections = collections.filter((coll) => coll.id !== collection.id);
      if (activeCollection === collection) {
        activeCollection = null;
        activePage = "default";
      }
    } catch (err) {
      //
    }
  }

  async function openRemoveEnv(envkey: string) {
    try {
      delete $activeProject.env[envkey];
      const response = await updateProject(project, $activeProject, apiKey);
      alertMessage.showInfo("Environment variable removed successfullly");
      $activeProject = $activeProject;

      if (activeEnv === envkey) {
        activeEnv = null;
        activePage = "default";
      }
    } catch (err) {
      //
    }
  }

  // db.schema.alterTable('functions').
  function addCollectionSubmit({ detail }: CustomEvent<ProjectCollection>) {
    console.log("addCollectionSubmit", detail);
    alertMessage.showInfo("Collection added successfully");
    collections = [...collections, detail];
    activeCollection = collections[collections.length - 1];
    activePage = "edit-collection";
  }
  function editCollectionSubmit() {
    // TODO
  }

  function addEnvSubmit({ detail }: CustomEvent) {
    // TODO
    alertMessage.showInfo("Environment Variable added successfully");

    $activeProject.env[detail.key] = detail.value;
    activePage = "edit-env";
    activeEnv = detail.key;
  }

  async function onContinue() {
    try {
      $activeProject = await getProject($page.params.project, apiKey);
      console.log($activeProject);
      functions = $activeProject.functions;
      collections = $activeProject.collections;

      alertMessage.showInfo("Welcome to minibase");
      hasAccess = true;
    } catch (err) {
      // show alert
      alertMessage.showError("You don't have access to this app");
    }
  }

  function closeSidebar() {
    open = false;
  }

  $: project = $page.params.project;

  let open = false;
</script>

{#if hasAccess}
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
      class="z-2 flex flex-col bg-blue-50 border-r !top-57px border-blue-400"
    >
      <Menu>
        <MenuItem title="Functions">
          <Button
            on:click={openAddFunction}
            slot="end"
            size="sm"
            shape="tile"
            class="text-blue-400 bg-blue-200 hover:bg-blue-400 hover:text-white hover:border-blue-400"
          >
            <Icon pack="la" name="plus" />
          </Button>
          <Menu>
            {#each functions as fn}
              <MenuItem on:click={() => openEditFunction(fn)} title={fn.name}>
                <Icon slot="start" pack="mdi" name="function" />
                <Button
                  on:click={() => openRemoveFunction(fn)}
                  slot="end"
                  size="sm"
                  shape="tile"
                  class="text-red-400 bg-red-200 hover:bg-red-400 hover:text-white hover:border-red-400"
                >
                  <Icon pack="mdi" name="trash-can" />
                </Button>
              </MenuItem>
            {/each}
          </Menu>
        </MenuItem>
        <MenuItem title="Collections">
          <Button
            on:click={openAddCollection}
            slot="end"
            size="sm"
            shape="tile"
            class="text-blue-400 bg-blue-200 hover:bg-blue-400 hover:text-white hover:border-blue-400"
          >
            <Icon pack="la" name="plus" />
          </Button>
          <Menu>
            {#each collections as collection}
              <MenuItem
                on:click={() => openEditCollection(collection)}
                title={collection.name}
              >
                <Icon slot="start" pack="mdi" name="database" />
                <Button
                  on:click={() => openRemoveCollection(collection)}
                  slot="end"
                  size="sm"
                  shape="tile"
                  class="text-red-400 bg-red-200 hover:bg-red-400 hover:text-white hover:border-red-400"
                >
                  <Icon pack="mdi" name="trash-can" />
                </Button>
              </MenuItem>
            {/each}
          </Menu>
        </MenuItem>
        <MenuItem title="Environment Variables">
          <Button
            on:click={openAddEnv}
            slot="end"
            size="sm"
            shape="tile"
            class="text-blue-400 bg-blue-200 hover:bg-blue-400 hover:text-white hover:border-blue-400"
          >
            <Icon pack="la" name="plus" />
          </Button>
          <Menu>
            {#each Object.keys($activeProject.env) as envkey}
              <MenuItem on:click={() => openEditEnv(envkey)} title={envkey}>
                <Icon slot="start" pack="mdi" name="database" />
                <Button
                  on:click={() => openRemoveEnv(envkey)}
                  slot="end"
                  size="sm"
                  shape="tile"
                  class="text-red-400 bg-red-200 hover:bg-red-400 hover:text-white hover:border-red-400"
                >
                  <Icon pack="mdi" name="trash-can" />
                </Button>
              </MenuItem>
            {/each}
          </Menu>
        </MenuItem>
      </Menu>
    </AppSidebar>

    <Main backdrop={open && $media.sm}>
      {#if activePage === "edit-collection" && activeCollection}
        <CollectionEditor
          {apiKey}
          mode="edit"
          data={activeCollection}
          {project}
          on:back={() => (activePage = "default")}
          on:save={editCollectionSubmit}
        />
      {:else if activePage === "edit-function" && activeFunction}
        <FunctionEditor
          {apiKey}
          mode="edit"
          name={activeFunction.name}
          data={activeFunction}
          {project}
          on:back={() => (activePage = "default")}
          on:save={editFunctionSubmit}
        />
      {:else if activePage === "edit-env" && activeEnv}
        <!-- mode="edit"
        name={activeEnv.name}
        data={activeEnv}
        {project}
        on:back={() => activePage = 'default'} on:save={editEnvSubmit} -->
        <EnvEditor
          projectInfo={$activeProject}
          mode="edit"
          key={activeEnv}
          bind:value={$activeProject.env[activeEnv]}
          on:back={() => (activePage = "default")}
          on:save={editEnvSubmit}
          {apiKey}
        />
      {:else if activePage === "add-collection"}
        <CollectionEditor
          {apiKey}
          mode="add"
          {project}
          on:back={() => (activePage = "default")}
          on:save={addCollectionSubmit}
        />
      {:else if activePage === "add-function"}
        <FunctionEditor
          {apiKey}
          mode="add"
          {project}
          on:back={() => (activePage = "default")}
          on:save={addFunctionSubmit}
        />
      {:else if activePage === "add-env"}
        <EnvEditor
          {apiKey}
          mode="add"
          projectInfo={$activeProject}
          on:back={() => (activePage = "default")}
          on:save={addEnvSubmit}
        />
      {:else}
        Welcome to Dashboard
      {/if}
    </Main>
  </App>
{/if}

<Dialog persistent placement="center" open={!hasAccess}>
  <DialogContent>
    <DialogBody>
      <FormInput label="Enter Project's ApiKey" bind:value={apiKey} />
    </DialogBody>
    <DialogFooter>
      <Button href="/projects">Back</Button>
      <Button color="primary" on:click={onContinue}>Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
