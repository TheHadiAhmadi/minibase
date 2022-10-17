<script lang="ts">
  import { addFunction, editFunction, removeFunction } from "$services/api";
  import type { ProjectFunction, ProjectInfo } from "$types";
  import { createEventDispatcher } from "svelte";
  import { page } from "$app/stores";

  import MenuItem from "./MenuItem.svelte";
  import { goto } from "$app/navigation";

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

  const dispatch = createEventDispatcher();

  async function add() {
    try {
      const code = ` `;
      const fn = await addFunction(
        { name, project: project.name, code },
        $page.data.apiKey
      );
      project.functions = [...(project.functions ?? []), fn];

      openEditPage(fn);
      name = "";
      openAdd = false;
    } catch (err) {}
  }

  function openEditPage(fn: ProjectFunction) {
    goto(`/${project.name}/functions/${fn.name}`);
  }

  async function remove(fn: ProjectFunction) {
    console.log("prompt");
    const result = await removeFunction(
      project.name,
      fn.id!,
      $page.data.apiKey
    );
    project.functions = project.functions?.filter((fun) => fun.id !== fn.id);
  }

  async function rename(fn: ProjectFunction, newName: string) {
    console.log("rename");
    fn.name = newName;

    const result = await editFunction(fn.id!, fn, $page.data.apiKey);
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
      <MenuItem on:click={() => openEditPage(fn)} title={fn.name}>
        <Icon slot="start" pack="mdi" name="function" />

        <Button
          on:click={() => remove(fn)}
          size="sm"
          slot="end"
          shape="tile"
          class="text-red-400 bg-red-200 hover:bg-red-400 hover:text-white hover:border-red-400"
        >
          <Icon pack="mdi" name="trash-can" />
        </Button>
      </MenuItem>
    {/each}

    {#if openAdd}
      <MenuItem class="py-1 flex gap-2" on:rename={add}>
        <input
          placeholder="Enter a name..."
          class="border border-gray-200 outline-none flex-1"
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
