<script lang="ts">
  import type { CollectionSchema } from "$types";

  export let schem: CollectionSchema = {
    name: "",
    type: "string",
  };
</script>

<Row>
  <FormInput
    cols="9"
    placeholder="Collection's name..."
    bind:value={schem.name}
  />

  <Col cols="2">
    <Button block>{schem.type}</Button>
    <UMenu>
      <a
        href="/"
        on:click|preventDefault={() => (schem.type = "string")}
        class="dropdown-item"
      >
        string
      </a>
      <a
        href="/"
        on:click|preventDefault={() => (schem.type = "boolean")}
        class="dropdown-item"
      >
        boolean
      </a>
      <a
        href="/"
        on:click|preventDefault={() => (schem.type = "number")}
        class="dropdown-item"
      >
        number
      </a>
      <a
        href="/"
        on:click|preventDefault={() => (schem.type = "object")}
        class="dropdown-item"
      >
        object
      </a>
      <a
        href="/"
        on:click|preventDefault={() => (schem.type = "array")}
        class="dropdown-item"
      >
        array
      </a>
    </UMenu>
  </Col>

  <Col cols="">
    <slot />
  </Col>
</Row>
