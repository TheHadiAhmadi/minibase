<script lang="ts">
  import { goto, invalidate, invalidateAll } from "$app/navigation";
  import CollectionEditor from "$components/CollectionEditor.svelte";
  import SchemaEditor from "$components/SchemaEditor.svelte";
  import api from "$services/api";
  import type { PageData } from "./$types";

  export let data: PageData;

  let newName = data.collection.name;

  $: console.log(data);
  async function save() {
    const result = await api.editCollection(
      data.project.name,
      data.collection.name,
      { ...data.collection, name: newName }
    );

    data.collection = result;
    invalidateAll();
    goto(`./`);
  }
</script>

<div class="h-screen">
  <Dialog persistent placement="center" absolute open>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Edit "{data.collection.name}"
        </DialogTitle>
        <CardActions class="-mr-10">
          <ButtonGroup>
            <Button on:click={() => goto("/" + data.project.name)}>Back</Button>
            <Button color="primary" on:click={save}>Save</Button>
          </ButtonGroup>
        </CardActions>
      </DialogHeader>

      <DialogBody class="overflow-y-auto max-h-screen">
        <FormInput label="name" bind:value={newName} />
        <FormField class="!-mb-4">
          <Label>Columns</Label>
          <SchemaEditor bind:schema={data.collection.schema} />
        </FormField>
      </DialogBody>
    </DialogContent>
  </Dialog>
</div>
