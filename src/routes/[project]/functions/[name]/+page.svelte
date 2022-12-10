<script lang="ts">
  import type { ProjectFunction } from "$types";
  import type { SvelteComponent } from "svelte";
  import api from "$services/api";

  import type { PageData } from "./$types";
  import { goto, invalidateAll } from "$app/navigation";
  import { Menu } from "@ubeac/svelte/components";

  export let data: PageData;

  let state = "clean";

  let prevCode = data.function.code;

  async function save() {
    try {
      if (state !== "dirty") return;
      data.function.code = code;
      data.function.project = data.project.name;
      state = "saving";
      const response: ProjectFunction = await api.editFunction(
        data.project.name,
        data.function.id!,
        data.function
      );
      state = "clean";

      data.function = response;
      invalidateAll();
    } catch (err) {
      //
    }
  }

  let codeEditor: SvelteComponent;

  let code = data.function.code;

  function updateCode(name?: string) {
    console.log("update");
    codeEditor?.updateCode(data.function.code);
    code = data.function.code;
  }

  async function setMethod(method: string) {
    data.function.method = method
    const response: ProjectFunction = await api.editFunction(
        data.project.name,
        data.function.id!,
        data.function
      );
      
  }

  $: if (prevCode !== code) state = "dirty";
  else state = "clean";

  $: updateCode(data.function.name);

</script>

<Card class="h-full flex flex-col">
  <CardHeader>
    <CardTitle>
      Edit "{data.function.name}" (TODO: Playground)
    </CardTitle>
    <CardActions>
      <ButtonGroup>
        <Button>Method ({method})</Button>
        <Menu>
          <a class="dropdown-item" on:click={() => setMethod("POST"))}>POST</a>
          <a class="dropdown-item" on:click={() => setMethod("GET"))}>GET</a>
          <a class="dropdown-item" on:click={() => setMethod("PUT"))}>PUT</a>
          <a class="dropdown-item" on:click={() => setMethod("DELETE"))}>
            DELETE
          </a>
        </Menu>
        <Button on:click={() => goto("/" + data.project.name)}>Back</Button>
        <Button
          loading={state === "saving"}
          disabled={state !== "dirty"}
          color="primary"
          on:click={save}
        >
          {#if state === "clean"}
            <Icon pack="material-symbols" name="check" />
          {:else if state === "dirty"}
            <Icon pack="material-symbols" name="save-outline" />
          {:else if state === "saving"}
            <Icon pack="material-symbols" name="save-outline" />
          {/if}
          Save
        </Button>
      </ButtonGroup>
    </CardActions>
  </CardHeader>

  <div class="overflow-y-auto h-full">
    <CodeEditor bind:this={codeEditor} bind:code />
  </div>
  <div class="w-full border-t border-gray-300 h-6 bg-gray-100" />
</Card>
