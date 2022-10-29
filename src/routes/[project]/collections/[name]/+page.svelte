<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import api from "$services/api";
  import type { CollectionRow } from "$types";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let jsonModalOpen = false;
  let activeRow: CollectionRow | any = null;

  let loadingData = false;

  let editModalOpen = false;
  let editingData: CollectionRow | null | any = null;

  let mode: "add" | "update" = "add";
  let values: CollectionRow[] = [];

  function openAdd() {
    editingData = {};
    mode = "add";
    editModalOpen = true;
  }

  function openEdit(value: CollectionRow) {
    editingData = value;
    mode = "update";
    editModalOpen = true;
  }

  async function remove(value: CollectionRow) {
    await api.removeData(data.project.name, data.collection.name, value.id);
    //
  }

  async function reload(deps?: any) {
    if (!browser) return;
    values = await api.getRows(data.project.name, data.collection.name);
    console.log(values);

    //
  }
  async function add() {
    const value = await api.insertData(
      data.project.name,
      data.collection.name,
      editingData
    );
    values = [...values, value];
    editModalOpen = false;
  }
  async function save() {
    const value = await api.editData(
      data.project.name,
      data.collection.name,
      editingData.id,
      editingData
    );
    values = values.map((val) => {
      if (val.id === value.id) return value;
      return val;
    });
    editModalOpen = false;
  }

  function back() {
    goto(`/${data.project.name}`);
  }

  function cancel() {
    //
    editModalOpen = false;
    editingData = null;
  }

  function openEditSchema() {
    goto(`/${data.project.name}/collections/${data.collection.name}/edit`);
  }

  $: reload(data.collection.name);
</script>

{#if loadingData}
  <AppLoadingBar color="azure" show indeterminate />
{/if}
<CardHeader slot="header">
  <CardTitle>
    View "{data.collection.name}"
  </CardTitle>
  <CardActions>
    <ButtonGroup>
      <Button on:click={reload}>Reload</Button>
      <Button on:click={openEditSchema}>Edit Schema</Button>
    </ButtonGroup>
  </CardActions>
</CardHeader>
<Table>
  <TableHead>
    <TableRow>
      {#each data.collection.schema as schem}
        <TableCell>
          {schem.name}
          <Badge class="ml-1">{schem.type}</Badge>
        </TableCell>
      {/each}
      <TableCell>Actions</TableCell>
    </TableRow>
  </TableHead>
  <TableBody class={loadingData ? "height-loading" : ""}>
    {#each values as value, i}
      <TableRow>
        {#each data.collection.schema as schem}
          <TableCell>{value[schem.name]}</TableCell>
        {/each}
        <TableCell class="w-0">
          <ButtonGroup compact>
            <Button
              on:click={() => openEdit(value)}
              size="sm"
              color="info"
              class="border-none"
            >
              <Icon pack="mdi" name="pencil" />
            </Button>
            <Button
              on:click={() => {
                activeRow = value;
                jsonModalOpen = true;
              }}
              size="sm"
              color="warning"
              class="border-none"
            >
              <Icon pack="mdi" name="json" />
            </Button>
            <Button
              on:click={() => remove(value)}
              size="sm"
              color="danger"
              class="border-none"
            >
              <Icon pack="mdi" name="trash-can" />
            </Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
<CardFooter slot="footer">
  <CardActions>
    <ButtonGroup>
      <Button on:click={back}>Back</Button>
      <Button color="primary" on:click={openAdd}>Insert Data</Button>
    </ButtonGroup>
  </CardActions>
</CardFooter>

<Dialog bind:open={editModalOpen}>
  <DialogContent>
    <DialogHeader>Edit Data</DialogHeader>
    <DialogBody>
      {#if editingData}
        {#each data.collection.schema as schem}
          {#if schem.type === "number"}
            <FormInput
              label={schem.name}
              type="number"
              bind:value={editingData[schem.name]}
            />
          {:else if schem.type === "string"}
            <FormInput
              label={schem.name}
              bind:value={editingData[schem.name]}
            />
          {:else if schem.type === "boolean"}
            <FormCheckbox
              text={schem.name}
              label={schem.name}
              bind:value={editingData[schem.name]}
            />
          {:else}
            <FormTextarea
              bind:value={editingData[schem.name]}
              label={schem.name}
            />
          {/if}
        {/each}
      {/if}
    </DialogBody>
    <DialogFooter>
      <ButtonGroup>
        <Button on:click={cancel}>Cancel</Button>
        {#if mode === "update"}
          <Button color="primary" on:click={save}>Save</Button>
        {:else}
          <Button color="primary" on:click={add}>Insert</Button>
        {/if}
      </ButtonGroup>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog placement="center" bind:open={jsonModalOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>View row as JSON</DialogTitle>
    </DialogHeader>
    <DialogBody>
      <pre class="dark:bg-[#404040]">{JSON.stringify(activeRow, null, 2)}</pre>
    </DialogBody>
    <DialogFooter>
      <Button on:click={() => (jsonModalOpen = false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<style global>
  .height-loading {
    height: 150px;
  }
</style>
