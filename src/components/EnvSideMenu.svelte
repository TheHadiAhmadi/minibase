<script lang="ts">
  //   import type { ProjectFunction, ProjectInfo } from "$types";
  import { page } from "$app/stores";

  import MenuItem from "./MenuItem.svelte";
  import { goto } from "$app/navigation";
  import api from "$services/api";
  import type { ProjectInfo } from "$types";

  let key: string = "";
  let value: string = " ";

  let openAdd: boolean = false;

  const disabledRead =
    !$page.data.scopes.includes("admin:project") &&
    !$page.data.scopes.includes("read:env");
  const disabledWrite =
    !$page.data.scopes.includes("admin:project") &&
    !$page.data.scopes.includes("write:env");

  let project: ProjectInfo;
  $: project = $page.data.project;

  async function add() {
    try {
      const fn = await api.updateProject(project.name, {
        ...project,
        env: {
          ...project.env,
          [key]: value,
        },
      });
      project.env = { ...(project.env ?? {}), [key]: value };

      openViewPage(key);
      key = "";
      value = " ";

      openAdd = false;
    } catch (err) {}
  }

  function openEditPage(key: string) {
    goto(`/${project.name}/env/${key}/edit`);
  }

  function openViewPage(key: string) {
    goto(`/${project.name}/env/${key}`);
  }

  async function remove(key: string) {
    console.log("prompt");
    const env = project.env;
    if (!env) return;

    delete env[key];
    const result = await api.updateProject(project.name, { ...project, env });
    project.env = env;
  }

  //   async function rename(key: string, newName: string) {
  //     console.log("rename");
  //     fn.name = newName;

  //     const result = await api.editFunction(project.name, fn.id!, fn);
  //     project.functions = project.functions?.map((fun) => {
  //       if (fun.id === fn.id) return fn;
  //       return fun;
  //     });
  //   }
  let openMenu = false;
</script>

<MenuItem
  disabled={disabledRead}
  bind:open={openMenu}
  title="Environment Variables"
>
  <Button
    disabled={disabledWrite}
    on:click={() => {
      openMenu = true;
      openAdd = true;
    }}
    slot="end"
    size="sm"
    shape="tile"
    class="text-blue-400 bg-blue-200 hover:bg-blue-400 hover:text-white hover:border-blue-400"
  >
    <Icon pack="la" name="plus" />
  </Button>
  <Menu slot="content">
    {#each Object.keys(project.env ?? {}) ?? [] as key}
      <MenuItem on:click={() => openViewPage(key)} title={key}>
        <Icon slot="start" pack="mdi" name="lock" />

        <ButtonGroup slot="end">
          <Button
            on:click={() => openViewPage(key)}
            size="sm"
            shape="tile"
            class="text-blue-400 bg-blue-200 hover:bg-blue-400 hover:text-white hover:border-blue-400"
          >
            <Icon pack="mdi" name="pencil" />
          </Button>
          <Button
            on:click={() => remove(key)}
            size="sm"
            shape="tile"
            class="text-red-400 bg-red-200 hover:bg-red-400 hover:text-white hover:border-red-400"
          >
            <Icon pack="mdi" name="trash-can" />
          </Button>
        </ButtonGroup>
      </MenuItem>
    {/each}

    {#if openAdd}
      <MenuItem class="py-1 flex gap-2" on:rename={add}>
        <input
          placeholder="Enter a name..."
          class="border bg-white/10 p-1 h-24px border-gray-200 dark:border-[#606060] outline-none flex-1"
          size="4"
          bind:value={key}
        />
        <ButtonGroup>
          <Button color="primary" size="sm" on:click={add}>
            <Icon name="check" />
          </Button>
          <Button color="primary" size="sm" on:click={() => (openAdd = false)}>
            <Icon name="x" />
          </Button>
        </ButtonGroup>
      </MenuItem>
    {:else}
      <Button
        size="sm"
        class="mt-1"
        color="primary"
        on:click={() => (openAdd = true)}>+ Add Environment Variable</Button
      >
    {/if}
  </Menu>
</MenuItem>
