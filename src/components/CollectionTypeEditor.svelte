<script lang="ts">
  import type { CollectionSchema } from "$types";

  export let schem: CollectionSchema = {
    name: "",
    type: "string",
  };

  let items = ["string", "number", "uuid", "boolean", "json"];
</script>

<El row>
  <FormInput
    cols="7"
    placeholder="Collection's name..."
    bind:value={schem.name}
  />

  <Col cols="2">
    <Button block>Type</Button>
    <Popover trigger="click">
      <PopoverBody>
        <FormSelect {items} bind:value={schem.type} />
        <FormSwitch label="Is Array?" />
      </PopoverBody>
    </Popover>
  </Col>

  <Col cols="3">
    <slot />
  </Col>
</El>
