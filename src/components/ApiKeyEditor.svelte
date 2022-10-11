<script lang="ts">
  import { addApiKey } from "$services/api";
  import { APIKEY_SCOPES, type ApiKey } from "$types";
  import { createEventDispatcher, getContext } from "svelte";

  export let apiKey: string;

  const context = getContext<any>("project");
  const project = context.project;

  const request: ApiKey = {
    name: "",
    scopes: [],
  };
  const dispatch = createEventDispatcher();

  async function add() {
    try {
      const result = await addApiKey($project.name, request, apiKey);

      dispatch("add-apikey", result);
    } catch (err) {}
  }
</script>

<FormInput label="name" bind:value={request.name} />
<FormCheckboxGroup
  text="key"
  key="value"
  bind:value={request.scopes}
  items={Object.entries(APIKEY_SCOPES).map(([key, value]) => ({ key, value }))}
/>
<Button on:click={add}>Add</Button>

{apiKey}
{project}
{JSON.stringify($project)}

<!-- {#each $project.apiKeys as key}
{/each} -->

<!-- List all apiKeys -->
<!-- {#each } -->

<!-- Name -->
<!-- scopes -->

<!-- after submit -->
<!-- show value -->

<Dialog>
  <DialogContent>
    <DialogTitle>Add ApiKey</DialogTitle>
  </DialogContent>
</Dialog>
