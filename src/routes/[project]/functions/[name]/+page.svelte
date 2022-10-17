<script lang="ts">
  import type { ProjectFunction } from "$types";
  import { createEventDispatcher, SvelteComponent } from "svelte";
  import { editFunction } from "$services/api";
  // import Main from "./Main.svelte";
  // import { alertMessage } from "$stores/alert";
  // import MainBody from "./MainBody.svelte";
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";

  export let data: PageData;

  $: console.log(data);

  const dispatch = createEventDispatcher();

  async function save() {
    try {
      data.function.code = code;
      data.function.project = data.project.name;
      const response: ProjectFunction = await editFunction(
        data.function.id!,
        data.function,
        data.apiKey
      );

      data.function = response;

      // dispatch("save", response);
    } catch (err) {
      //
    }
  }

  let codeEditor: SvelteComponent;

  let code = data.function.code;

  function updateCode(name?: string) {
    codeEditor?.updateCode(data.function.code);
    code = data.function.code;
  }

  $: updateCode(data.function.name);
</script>

<Card>
  <CardHeader>
    <CardTitle>
      Edit "{data.function.name}" (TODO: Playground)
    </CardTitle>
    <CardActions>
      <ButtonGroup>
        <Button size="sm" on:click={() => goto("/" + data.project.name)}>
          Back
        </Button>
        <Button size="sm" color="primary" on:click={save}>Save</Button>
      </ButtonGroup>
    </CardActions>
  </CardHeader>

  <div class="overflow-y-auto max-h-screen">
    <CodeEditor bind:this={codeEditor} bind:code />
  </div>
</Card>
