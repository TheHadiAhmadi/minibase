<script lang="ts">
  import { goto, invalidate, invalidateAll } from "$app/navigation";
  import CollectionEditor from "$components/CollectionEditor.svelte";
  import RoutesEditor from "$components/RoutesEditor.svelte";
  import SchemaEditor from "$components/SchemaEditor.svelte";
  import api from "$services/api";
  import type { PageData } from "./$types";

  export let data: PageData;

  let newName = data.function.name;

  $: console.log(data);
  async function save() {
    const result = await api.editFunction(
      data.project.name,
      data.function.id!,
      {
        ...data.function,
        name: newName,
      }
    );

    await goto(`/${data.project.name}`);
    data.function = result;
    invalidateAll();
  }
</script>

<div class="h-screen">
  <Dialog persistent placement="center" absolute open>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Edit "{data.function.name}"
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
        Readme

        <br />
        input/output schema
        <!-- <FormField class="!-mb-4">
          <Label>Routes</Label>
          <RoutesEditor bind:routes={data.function.routes} />
        </FormField> -->
      </DialogBody>
    </DialogContent>
  </Dialog>
</div>
