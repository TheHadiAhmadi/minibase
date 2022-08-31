<script>
import AppCard from "./AppCard.svelte";


import Page from "./Page.svelte";

export let apps;
export let title
</script>
<Page full {title}>
	<slot name="actions" slot="actions"/>
    <div class="card-body grid gap-4 grid-cols-1 mx-auto md:grid-cols-2 xl:grid-cols-3">
        {#each apps as app}
            <AppCard {...app} />
        {:else}
            <p>There are no public apps yet</p>
        {/each}
    </div>
</Page>