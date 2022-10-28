<script lang="ts">
  import { goto } from "$app/navigation";
  import api from "$services/api";
  import type { PageData } from "./$types";

  export let data: PageData;

  function back() {
    goto("../");
  }

  async function save() {
    try {
      const result = await api.updateProject(data.project.name, {
        ...data.project,
        env: { ...data.project.env, [data.key]: data.value },
      });
      console.log({ result });
    } catch (err) {
      //
    }
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>Edit Environment Variable</CardTitle>
  </CardHeader>
  <CardBody>
    <FormInput readonly label="name" bind:value={data.key} />

    <FormTextarea
      placeholder="Enter value..."
      label="value"
      bind:value={data.value}
    />
  </CardBody>

  <CardFooter>
    <CardActions>
      <Button on:click={back}>Back</Button>
      <Button color="primary" on:click={save}>Save</Button>
    </CardActions>
  </CardFooter>
</Card>
