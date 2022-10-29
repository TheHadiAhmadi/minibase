<script lang="ts">
  import type {
    CollectionSchema,
    ProjectCollection,
    ProjectInfo,
  } from "$types";
  import { createEventDispatcher } from "svelte";
  import { page } from "$app/stores";

  import MenuItem from "./MenuItem.svelte";
  import { goto } from "$app/navigation";
  import api from "$services/api";

  let name: string = "";

  let openAdd: boolean = false;

  const disabledRead =
    !$page.data.scopes.includes("admin:project") &&
    !$page.data.scopes.includes("read:collection");
  const disabledWrite =
    !$page.data.scopes.includes("admin:project") &&
    !$page.data.scopes.includes("write:collection");

  let project: ProjectInfo;
  $: project = $page.data.project;

  async function add() {
    try {
      const schema: CollectionSchema[] = [];
      const collection = await api.addCollection(project.name, {
        name,
        project: project.name,
        schema,
      });
      project.collections = [...(project.collections ?? []), collection];

      openEditPage(collection);
      name = "";
      openAdd = false;
    } catch (err) {}
  }

  function openEditPage(collection: ProjectCollection) {
    goto(`/${project.name}/collections/${collection.name}/edit`);
  }

  function openViewPage(collection: ProjectCollection) {
    goto(`/${project.name}/collections/${collection.name}`);
  }

  async function remove(collection: ProjectCollection) {
    console.log("prompt");
    await api.removeCollection(project.name, collection.name);

    project.collections = project.collections?.filter(
      (coll) => coll.id !== collection.id
    );
  }

  async function rename(collection: ProjectCollection, newName: string) {
    console.log("rename");
    const prevName = collection.name
    collection.name = newName;

    const result = await api.editCollection(
      project.name,
      prevName,
      collection
    );

    project.collections = project.collections?.map((coll) => {
      if (coll.id === collection.id) return collection;
      return coll;
    });
  }
</script>

<MenuItem disabled={disabledRead} open={openAdd} title="Collections">
  <Button
    disabled={disabledWrite}
    on:click={() => (openAdd = true)}
    slot="end"
    size="sm"
    shape="tile"
    class="text-blue-400 bg-blue-200 hover:bg-blue-400 hover:text-white hover:border-blue-400"
  >
    <Icon pack="la" name="plus" />
  </Button>
  <Menu slot="content">
    {#each project.collections ?? [] as collection}
      <MenuItem
        on:click={() => openViewPage(collection)}
        title={collection.name}
      >
        <Icon slot="start" pack="mdi" name="database" />

        <ButtonGroup slot="end">
          <Button
            on:click={() => openEditPage(collection)}
            size="sm"
            shape="tile"
            class="text-blue-400 bg-blue-200 hover:bg-blue-400 hover:text-white hover:border-blue-400"
          >
            <Icon pack="mdi" name="pencil" />
          </Button>
          <Button
            on:click={() => remove(collection)}
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
        on:click={() => (openAdd = true)}>+ Add Collection</Button
      >
    {/if}
  </Menu>
</MenuItem>
