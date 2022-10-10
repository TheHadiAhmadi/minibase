<script lang="ts">
  import type { CollectionSchema } from "$types";
  import CollectionTypeEditor from "./CollectionTypeEditor.svelte";

  export let schema: CollectionSchema[];

  let newSchem: CollectionSchema = {
    name: "",
    type: "string",
  };

  function add() {
    schema = [...schema, newSchem]
    newSchem = { name: '', type: 'string'}
  }

  function remove(schem: CollectionSchema) {
    schema = schema.filter(sch => sch !== schem)
  }
</script>

<Row>
  {#each schema as schem}
  <CollectionTypeEditor bind:schem={schem}>
    <Button block color="danger" on:click={() => remove(schem)}>
        Remove
    </Button>
    </CollectionTypeEditor>
  {/each}
  <Col cols="12">
    <Divider>New</Divider>
</Col>
  <CollectionTypeEditor bind:schem={newSchem}>
    <Button color="primary" block on:click={add}>
    Add
    </Button>
    </CollectionTypeEditor>
  </Row> 
  