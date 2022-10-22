<script lang="ts">
  import { addApiKey } from "$services/api";
  import { APIKEY_SCOPES, type ApiKey, type ProjectInfo } from "$types";
  import { createEventDispatcher, getContext } from "svelte";
  import { page } from "$app/stores";
  import ApiKeyValue from "./ApiKeyValue.svelte";

  // export let apiKey: string;

  const project: ProjectInfo = $page.data.project;

  const request: ApiKey = {
    name: "",
    scopes: [],
  };

  const dispatch = createEventDispatcher();

  let value = '';
  let show = false;

  async function add() {
    try {
      const result: ApiKey = await addApiKey(project.name, request);

      console.log(result)
      value = result.value ?? ''
      show = true;
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
{#if show}
  <ApiKeyValue {value} />
{/if}

{project}
{JSON.stringify(project)}

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
