<script lang="ts">
  import type { ProjectFunction, ProjectInfo } from "$types";
  import { page } from "$app/stores";

  import MenuItem from "./MenuItem.svelte";
  import { goto } from "$app/navigation";
  import api from "$services/api";

  let name: string = "";

  let openAdd: boolean = false;

  const disabledRead =
    !$page.data.scopes.includes("admin:project") &&
    !$page.data.scopes.includes("read:function");
  const disabledWrite =
    !$page.data.scopes.includes("admin:project") &&
    !$page.data.scopes.includes("write:function");

  let project: ProjectInfo;
  $: project = $page.data.project;

  async function add() {
    try {
      const code = ` `;
      const fn = await api.addFunction(project.name, {
        name,
        project: project.name,
        code,
        routes: [],
      });
      project.functions = [...(project.functions ?? []), fn];

      openViewPage(fn);
      name = "";
      openAdd = false;
    } catch (err) {}
  }

  function openEditPage(fn: ProjectFunction) {
    goto(`/${project.name}/functions/${fn.name}/edit`);
  }

  function openViewPage(fn: ProjectFunction) {
    goto(`/${project.name}/functions/${fn.name}`);
  }

  async function remove(fn: ProjectFunction) {
    console.log("prompt");
    const result = await api.removeFunction(project.name, fn.id!);
    project.functions = project.functions?.filter((fun) => fun.id !== fn.id);
  }

  async function rename(fn: ProjectFunction, newName: string) {
    console.log("rename");
    fn.name = newName;

    const result = await api.editFunction(project.name, fn.id!, fn);
    project.functions = project.functions?.map((fun) => {
      if (fun.id === fn.id) return fn;
      return fun;
    });
  }
  let openMenu = false;
</script>

<MenuItem disabled={disabledRead} bind:open={openMenu} title="Functions">
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
    {#each project.functions ?? [] as fn}
      <MenuItem on:click={() => openViewPage(fn)} title={fn.name}>
        <Icon slot="start" pack="mdi" name="function" />

        <ButtonGroup slot="end">
          <Button
            on:click={() => openEditPage(fn)}
            size="sm"
            shape="tile"
            class="text-blue-400 bg-blue-200 hover:bg-blue-400 hover:text-white hover:border-blue-400"
          >
            <Icon pack="mdi" name="pencil" />
          </Button>
          <Button
            on:click={() => remove(fn)}
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
          bind:value={name}
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
        on:click={() => (openAdd = true)}>+ Add Function</Button
      >
    {/if}
  </Menu>
</MenuItem>
