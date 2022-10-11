<script lang="ts">
  import { removeProject, updateProject } from "$services/api";
  import { createEventDispatcher } from "svelte";
  import ApiKeyEditor from "./ApiKeyEditor.svelte";

  export let apiKey: string;

  export let name: string;

  let newName = name;
  const dispatch = createEventDispatcher();
  async function save() {
    try {
      const result = await updateProject(name, { name: newName }, apiKey);
      name = newName;
      dispatch("save", { name });
    } catch (err) {}
  }

  async function remove() {
    try {
      await removeProject(name, apiKey);
      dispatch("remove");
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
  apiKey <br /> import / export data

  <FormField>
    <Label>ApiKey</Label>
    <ApiKeyEditor {apiKey} />
  </FormField>

  <Button color="danger" on:click={remove}>Remove Project</Button>
</CardBody>
