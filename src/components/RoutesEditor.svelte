<script lang="ts">
  export let routes: string[];

  let newRoute: string = "";
  function add() {
    routes = [...routes, newRoute];
    newRoute = "";
  }

  function remove(i: number) {
    routes = routes.filter((_, index) => index !== i);
  }
</script>

<Row>
  {#each routes as route, index}
    <Col cols="12">
      <Row justify="end">
        <FormInput placeholder="/route/:id" cols="grow" bind:value={route} />

        <Col cols="2">
          <Button color="danger" on:click={() => remove(index)}>
            <Icon name="minus" pack="mdi" />
          </Button>
        </Col>
      </Row>
    </Col>
  {/each}
  <Col cols="12">
    <Divider>New</Divider>
  </Col>
  <FormInput placeholder="/route/:id" bind:value={newRoute} />
  <Button color="primary" block on:click={add}>Add</Button>
</Row>
