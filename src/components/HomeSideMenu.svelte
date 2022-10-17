<script>
  import { goto } from "$app/navigation";

  import { page } from "$app/stores";
  import MenuItem from "./MenuItem.svelte";
</script>

<MenuItem on:click={() => goto(`/${$page.data.project.name}`)}>
  <Icon name="dashboard" pack="ci" slot="start" />
  <span slot="title">Home</span>
</MenuItem>
