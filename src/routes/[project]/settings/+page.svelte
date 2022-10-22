<script lang="ts">
  import { removeProject, updateProject } from "$services/api";
  import type { PageData } from "./$types";
  import { createEventDispatcher } from "svelte";
  import ApiKeyEditor from "$components/ApiKeyEditor.svelte";
  import { goto, invalidateAll } from "$app/navigation";

  export let data: PageData;

  let newName = data.project.name;
  const dispatch = createEventDispatcher();
  async function save() {
    try {
      const result = await updateProject(
        data.project.name,
        { name: newName }
      );
      data.project.name = newName;
    } catch (err) {}
  }

  async function remove() {
    try {
      console.log("PROMPT");
      await removeProject(data.project.name);
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
  <br />
  <br />
  apiKey <br /> import / export data

  <FormField>
    <Label>ApiKey</Label>
    <ApiKeyEditor />
  </FormField>

  <Button color="danger" on:click={remove}>Remove Project</Button>

  <br />
</CardBody>
