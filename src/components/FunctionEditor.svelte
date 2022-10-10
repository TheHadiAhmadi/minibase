<script lang="ts">
  import type { ProjectFunction } from "$types";
  import { createEventDispatcher, SvelteComponent } from "svelte";
  import { addFunction, editFunction } from "$services/api";
  import Main from "./Main.svelte";
  import { alertMessage } from "$stores/alert";
  import MainBody from "./MainBody.svelte";

  export let project: string;
  export let apiKey: string;
  export let data: ProjectFunction = {
    code: "",
    name: "",
    project,
  };

  export let mode: "add" | "edit" = "add";
  export let name: string | undefined = undefined;

  const dispatch = createEventDispatcher();

  async function edit() {
    try {

    const response: ProjectFunction = await editFunction(
      data.id!,
      data,
      apiKey
    );
    dispatch("save", response);

    }catch(err) {
      // 
    }
  }

  async function add() {
    try {
      const response: ProjectFunction = await addFunction(data, apiKey);
      dispatch("save", response);
    } catch (err) {
      // console.log("err" + err);
    }
  }

  let codeEditor: SvelteComponent;

  function back() {
    dispatch("back");
  }

  function save() {
    mode === "add" ? add() : edit();
  }

  function updateCode(name?: string) {
    codeEditor?.updateCode(data.code);
  }

  $: updateCode(name);
</script>

    <CardHeader>
      <CardTitle>
        {#if mode === "add"}
          Add Function
        {:else}
          Edit Function
        {/if}
      </CardTitle>
    </CardHeader>
    <MainBody>

      <FormInput label="name" bind:value={data.name} />

      <FormField>
        <Label>Code</Label>
        <CodeEditor bind:this={codeEditor} bind:code={data.code} />
      </FormField>
    </MainBody>

    <CardFooter>
      <CardActions>
        <Button on:click={back}>Back</Button>
        <Button color="primary" on:click={save}>Save</Button>
      </CardActions>
    </CardFooter>
