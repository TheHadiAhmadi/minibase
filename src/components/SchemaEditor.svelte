<script lang="ts">
  import type { CollectionSchema } from "$types";
  import CollectionTypeEditor from "./CollectionTypeEditor.svelte";

  export let schema: CollectionSchema[];

  $: console.log(schema);

  let newSchem: CollectionSchema = {
    name: "",
    type: "string",
    array: false,
    collection: "",
  };

  function add() {
    schema = [...schema, newSchem];
    newSchem = { name: "", type: "string" };
  }

  function remove(schem: CollectionSchema) {
    schema = schema.filter((sch) => sch !== schem);
  }
</script>

<Row>
  {#each schema as schem}
    <CollectionTypeEditor bind:schem>
      <Button color="danger" block on:click={() => remove(schem)}>
        <Icon name="minus" pack="mdi" />
        Remove
      </Button>
    </CollectionTypeEditor>
  {/each}
  <Col cols="12">
    <Divider>New</Divider>
  </Col>
  <CollectionTypeEditor bind:schem={newSchem}>
    <Button color="primary" block on:click={add}>
      <Icon name="plus" pack="mdi" />

      Add
    </Button>
  </CollectionTypeEditor>
</Row>
