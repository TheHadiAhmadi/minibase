<script lang="ts">
  import { updateProject } from "$services/api";
  import { createEventDispatcher } from "svelte";
  import Main from "./Main.svelte";
  export let apiKey: string;
  export let key: string | undefined = undefined;
  export let value: string | undefined = undefined;
  export let projectInfo: any;

  export let mode: "add" | "edit" = "add";

  const dispatch = createEventDispatcher();

  function back() {
    dispatch("back");
  }

  async function save() {
    if (key) {
      try {
        const result = await updateProject(
          projectInfo.name,
          {
            ...projectInfo,
            env: { ...projectInfo.env, [key]: value },
          },
          apiKey
        );
        console.log({ result });
        dispatch("save", { key, value });
      } catch (err) {
        //
      }
    }
  }
</script>

<CardHeader slot="header">
  <CardTitle>
    {#if mode === "add"}
      Add Environment Variable
    {:else}
      Edit Environment Variable
    {/if}
  </CardTitle>
</CardHeader>
<FormInput readOnly={mode === "edit"} label="name" bind:value={key} />

<FormTextarea placeholder="Enter value..." label="value" bind:value />

<CardFooter slot="footer">
  <CardActions>
    <Button on:click={back}>Back</Button>
    <Button color="primary" on:click={save}>Save</Button>
  </CardActions>
</CardFooter>
