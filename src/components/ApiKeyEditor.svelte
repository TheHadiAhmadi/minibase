<script lang="ts">
  import { addApiKey, removeApiKey } from "$services/api";
  import { APIKEY_SCOPES, type ApiKey, type ProjectInfo } from "$types";
  import { page } from "$app/stores";
  import ApiKeyValue from "./ApiKeyValue.svelte";
  import { invalidateAll } from "$app/navigation";

  const project: ProjectInfo = $page.data.project;

  let addApiKeyOpen = false;

  let request: ApiKey = {
    name: "",
    scopes: [],
  };

  let value = "";
  let show = false;

  async function add() {
    try {
      const result: ApiKey = await addApiKey(project.name, request);

      project.apiKeys = [...(project.apiKeys ?? []), result];
      value = result.value ?? "";
      request = {
        name: "",
        scopes: [],
      };
      show = true;
    } catch (err) {}
  }

  async function remove(id?: string) {
    await removeApiKey(project.name, id);
    project.apiKeys = project.apiKeys?.filter((apikey) => apikey.id !== id);
  }
</script>

{#each project.apiKeys ?? [] as key, index}
  <div class="flex mb-2 flex-col p-2 border border-gray-500">
    <div class="flex items-center justify-between">
      <div class="font-bold">{key.name}</div>
      {#if index > 0}
        <Button outline size="sm" color="red" on:click={() => remove(key.id)}>
          <Icon name="trash-can" pack="mdi" />
        </Button>
      {/if}
    </div>
    <div class="flex gap-2 flex-wrap text-lg">
      {#each key.scopes as scope}
        {@const color = scope.startsWith("read")
          ? "blue"
          : scope.startsWith("write")
          ? "green"
          : "red"}
        <Badge ghost {color} shape="round">{scope}</Badge>
      {/each}
    </div>
  </div>
{/each}

<Button
  color="primary"
  class="mt-3 ms-auto"
  on:click={() => (addApiKeyOpen = true)}>Add New ApiKey</Button
>

<!-- List all apiKeys -->
<!-- {#each } -->

<!-- Name -->
<!-- scopes -->

<!-- after submit -->
<!-- show value -->

<Dialog bind:open={addApiKeyOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add ApiKey</DialogTitle>
    </DialogHeader>
    <DialogBody>
      <FormInput label="name" bind:value={request.name} />
      <FormCheckboxGroup
        text="key"
        key="value"
        bind:value={request.scopes}
        items={Object.entries(APIKEY_SCOPES)
          .map(([key, value]) => ({ key, value }))
          .slice(0, -1)}
      />
      {#if show}
        <ApiKeyValue {value} />
      {/if}
    </DialogBody>
    <DialogFooter>
      <Button disabled={show} on:click={() => (addApiKeyOpen = false)}>
        Cancel
      </Button>
      {#if !show}
        <Button on:click={add}>Add</Button>
      {:else}
        <Button
          on:click={() => {
            addApiKeyOpen = false;
            show = false;
          }}>Done</Button
        >
      {/if}
    </DialogFooter>
  </DialogContent>
</Dialog>
