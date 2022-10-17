<script>
  import { goto } from "$app/navigation";

  import { page } from "$app/stores";
  import MenuItem from "./MenuItem.svelte";
</script>

<MenuItem
  disabled={!$page.data.scopes.includes("admin:project")}
  on:click={() => goto(`/${$page.data.project.name}/settings`)}
>
  <Icon name="cog" pack="mdi" slot="start" />
  <span slot="title">Settings</span>
</MenuItem>
