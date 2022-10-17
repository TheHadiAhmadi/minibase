<script lang="ts">
    import { addCollection } from "$services/api";
    import { createEventDispatcher } from "svelte";
  
    import MenuItem from "./MenuItem.svelte";
  
    let name: string = "";
    export let project: string;
    export let apiKey: string;
  
    const dispatch = createEventDispatcher();
  
    async function add() {
      try {
        const collection = await addCollection({ name, project, schema: [] }, apiKey);
        dispatch("add", collection);
        name = "";
      } catch (err) {}
    }
  
    function cancel() {
      dispatch("cancel");
    }
  </script>
  
  <MenuItem on:rename={add} editable renaming bind:title={name}>
    <svelte:fragment slot="start" />
    <Button size="sm" slot="end" on:click={cancel}>
      <Icon name="x" />
    </Button>
  </MenuItem>
  