<script lang="ts">
  import api from "$services/api";
  import type { PageData } from "./$types";
  import { createEventDispatcher } from "svelte";
  import ApiKeyEditor from "$components/ApiKeyEditor.svelte";
  import { goto, invalidateAll } from "$app/navigation";

  export let data: PageData;

  let newName = data.project!.name;
  const dispatch = createEventDispatcher();
  async function save() {
    try {
      await api.updateProject(data.project!.name, {
        name: newName,
      });
      data.project!.name = newName;
    } catch (err) {}
  }

  async function remove() {
    try {
      console.log("PROMPT");
      await api.removeProject(data.project!.name);
      goto('/projects')
    } catch (err) {
      //
    }
  }
</script>

<CardHeader>
  <CardTitle>Settings</CardTitle>
</CardHeader>

<CardBody>
  <FormInput label="Rename Project" bind:value={newName} />
  <Button on:click={save}>Rename</Button>

  <div class="p-6 opacity-50">
    <br /> import / export data
  </div>

  <FormField>
    <Label>ApiKeys</Label>
    <ApiKeyEditor />
  </FormField>

  <Button color="danger" on:click={remove}>Remove Project</Button>

  <br />
</CardBody>
