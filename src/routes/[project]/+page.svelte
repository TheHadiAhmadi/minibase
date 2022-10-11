<script lang="ts">
  import CollectionEditor from "$components/CollectionEditor.svelte";
  import FunctionEditor from "$components/FunctionEditor.svelte";
  import { media, activeProject } from "$stores";
  import { page } from "$app/stores";

  import type { ApiKey, ProjectCollection, ProjectFunction } from "src/types";
  import {
    getProject,
    removeCollection,
    removeFunction,
    updateProject,
  } from "$services/api";
  import Main from "$components/Main.svelte";
  import { alertMessage } from "$stores/alert";
  import EnvEditor from "$components/EnvEditor.svelte";
  import SettingsEditor from "$components/SettingsEditor.svelte";
  import { goto } from "$app/navigation";
  import { setContext } from "svelte";

  let collections: ProjectCollection[] = [];
  let functions: ProjectFunction[] = [];
  let apiKeys: ApiKey[] = [];
  let env: Array<{ key: string; value: string }> = [];

  let activeFunction: ProjectFunction | null = null;
  let activeEnv: { key: string; value: string } | null = null;
  let activeCollection: ProjectCollection | null = null;

  let hasAccess = false;
  let apiKey = "";
  let disabled = {
    "read:function": true,
    "read:data": true,
    "read:env": true,
    "write:function": true,
    "write:data": true,
    "write:env": true,
    "admin:project": true,
  };

  let activePage:
    | "edit-collection"
    | "add-collection"
    | "edit-function"
    | "add-function"
    | "edit-env"
    | "add-env"
    | "default"
    | "settings" = "default";

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
    activeEnv = null;
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
  function openEditEnv(key: { key: string; value: string }) {
    activePage = "edit-env";
    activeEnv = key;
    closeSidebar();
  }

  function openSettings() {
    activePage = "settings";
    closeSidebar();
  }

  function addFunctionSubmit({ detail }: CustomEvent) {
    functions = [...functions, detail as ProjectFunction];
    activeFunction = detail;
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

    env = env.map((en) => {
      if (en.key === detail.key) return detail;
      return en;
    });
  }

  function settingsSubmit({ detail }: CustomEvent) {
    console.log("Update", detail);
    $activeProject.name = detail.name;
    project = detail.name;

    goto(detail.name);
  }

  function settingsRemoveSubmit() {
    goto("/projects");
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
      // delete $activeProject.env[envkey];
      env = env.filter((en) => en.key !== envkey);
      const response = await updateProject(project, $activeProject, apiKey);
      alertMessage.showInfo("Environment variable removed successfullly");
      $activeProject = $activeProject;

      if (activeEnv?.key === envkey) {
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
    activeCollection = detail;
    activePage = "edit-collection";
  }
  function editCollectionSubmit() {
    // TODO
  }

  function addEnvSubmit({ detail }: CustomEvent) {
    alertMessage.showInfo("Environment Variable added successfully");

    env = [...env, detail];
    activePage = "edit-env";
    activeEnv = detail;
  }

  function disable(section: keyof typeof disabled) {
    disabled[section] = true;
  }
  function enable(section: keyof typeof disabled) {
    disabled[section] = false;
  }

  async function onContinue() {
    try {
      const result = await getProject($page.params.project, apiKey);
      $activeProject = result.project;

      console.log(result.scopes);
      
      result.scopes.map((scope) => {
        if(scope === 'admin:project') {
          enable('read:data')
          enable('read:env')
          enable('read:function')
          enable('write:function')
          enable('write:data')
          enable('write:env')
        }
        enable(scope);
      });

      if ($activeProject.functions) functions = $activeProject.functions;
      if ($activeProject.collections) collections = $activeProject.collections;
      if ($activeProject.env)
        env = Object.entries($activeProject.env).map(([key, value]) => ({
          key,
          value,
        }));
      if ($activeProject.apiKeys) apiKeys = $activeProject.apiKeys;

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
  setContext("project", { project: activeProject });

  let project = $page.params.project;

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
        <MenuItem disabled={disabled["read:function"]} title="Functions">
          <Button
            disabled={disabled["write:function"]}
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
        <MenuItem disabled={disabled["read:data"]} title="Collections">
          <Button
            disabled={disabled["write_collections"]}
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
                  disabled={disabled["write:data"]}
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
        <MenuItem disabled={disabled["read:env"]} title="Environment Variables">
          <Button
            disabled={disabled["write:env"]}
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

        <MenuItem
          disabled={disabled["admin:project"]}
          on:click={openSettings}
          title="Settings"
        >
          <Icon slot="start" pack="la" name="cog" />
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
          key={activeEnv.key}
          bind:value={activeEnv.value}
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
      {:else if activePage === "settings"}
        <SettingsEditor
          {apiKey}
          name={$activeProject.name}
          on:save={settingsSubmit}
          on:remove={settingsRemoveSubmit}
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
