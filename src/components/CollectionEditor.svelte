<script lang="ts">
  import {
    addCollection,
    editData,
    insertData,
    getRows,
    deleteData,
  } from "$services/api";

  import type { CollectionRow, ProjectCollection } from "$types";
  import { createEventDispatcher } from "svelte";
  import Main from "./Main.svelte";
  import MainBody from "./MainBody.svelte";
  import SchemaEditor from "./SchemaEditor.svelte";

  export let project: string;
  export let apiKey: string = "";

  export let data: ProjectCollection = {
    project,
    name: "",
    schema: [],
  };

  let dataMode: "add" | "edit" = "add";
  let values: any[] = [];

  let loading = false;
  let loadingData = false;

  let editModalOpen = false;
  let editingData: CollectionRow | null = null;

  async function remove(val: CollectionRow) {
    try {
      await deleteData(project, data.name, val.id, apiKey);
      values = values.filter((value) => value !== val);
    } catch (err) {
      //
    }
  }

  function openInsertData() {
    dataMode = "add";
    editModalOpen = true;
    editingData = {};
  }

  function openEdit(val: CollectionRow) {
    // open Edit modal
    dataMode = "edit";
    editModalOpen = true;
    editingData = val;
  }
  function cancelEdit() {
    editModalOpen = false;
    editingData = null;
  }

  async function edit() {
    if (editingData) {
      console.log(editingData);
      const result = await editData(
        project,
        data.name,
        editingData.id,
        editingData,
        apiKey
      );
      values = values.filter((value) => {
        if (value.id === editingData!.id) return result;
        return value;
      });
      editingData = {};
    }
    editModalOpen = false;
  }

  function back() {
    console.log("back");
    dispatch("back");
  }

  async function addData() {
    console.log("add Data", editingData);
    try {
      if (editingData) {
        const result = await insertData(
          project,
          data.name,
          editingData,
          apiKey
        );
        values = [...values, result];
        console.log({ values });
        editingData = {};
      }
    } catch (err) {
      //
    }
    editModalOpen = false;
  }

  const dispatch = createEventDispatcher();
  async function add() {
    try {
      loading = true;
      const result = await addCollection(data, apiKey);
      loading = false;
      dispatch("save", result);
    } catch (err) {
      //
    }
  }

  async function loadData(name: string) {
    console.log("loading");
    values = [];
    loadingData = true;
    values = await getRows({ project, name }, apiKey);
    loadingData = false;
  }

  $: mode === "edit" && loadData(data.name);

  export let mode: "add" | "edit" = "add";
</script>

{#if loadingData}
  <AppLoadingBar color="azure" show indeterminate />
{/if}
<CardHeader slot="header">
  <CardTitle>
    {#if mode == "add"}
      Add Collection
    {:else}
      View Collection "{data.name}"
    {/if}
  </CardTitle>
  {#if mode === "edit"}
    <CardActions>
      <Button on:click={openInsertData}>Insert Data</Button>
    </CardActions>
  {/if}
</CardHeader>
{#if mode !== "add"}
  <Table>
    <TableHead>
      <TableRow>
        {#each data.schema as schem}
          <TableCell
            >{schem.name}
            <Badge>{schem.type}</Badge>
          </TableCell>
        {/each}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody class={loadingData ? "height-loading" : ""}>
      {#each values as value, i}
        <TableRow>
          {#each data.schema as schem}
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
{:else}
  <MainBody>
    <FormInput label="name" bind:value={data.name} />
    <FormField>
      <Label>Schema</Label>
      <SchemaEditor bind:schema={data.schema} />
    </FormField>
  </MainBody>
{/if}
<CardFooter slot="footer">
  <CardActions>
    <ButtonGroup>
      <Button on:click={back}>Back</Button>
      {#if mode === "add"}
        <Button color="primary" on:click={add} {loading}>Add</Button>
      {/if}
    </ButtonGroup>
  </CardActions>
</CardFooter>

<Dialog bind:open={editModalOpen}>
  <DialogContent>
    <DialogHeader>Edit Data</DialogHeader>
    <DialogBody>
      {#if editingData}
        {#each data.schema as schem}
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
        <Button on:click={cancelEdit}>Cancel</Button>
        {#if dataMode === "edit"}
          <Button color="primary" on:click={edit}>Save</Button>
        {:else}
          <Button color="primary" on:click={addData}>Insert</Button>
        {/if}
      </ButtonGroup>
    </DialogFooter>
  </DialogContent>
</Dialog>

<style global>
  .height-loading {
    height: 150px;
  }
</style>
