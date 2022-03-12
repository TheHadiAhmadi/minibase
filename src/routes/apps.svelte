<script>
	import { goto } from '$app/navigation';

	import { AppCard, Page } from '$lib/components';
	import { get } from '$lib/api';
	import { sidebar } from '$lib/stores';
	import { Button, Icon } from '@ubeac/svelte-components';
	import { onMount } from 'svelte';

	let apps = [];

	// $title = 'apps';
	async function loadApps() {
		const res = await get(`/apps.json`);

		console.log(res);
		apps = res.apps ?? [];
		$sidebar = {
			title: 'apps',
			items: apps.map((app) => ({ href: '/' + app.name, name: app.name }))
		};
	}

	onMount(() => {
		loadApps();
	});
</script>

<Page title="Apps">
	<Button size="sm" slot="actions" on:click={() => goto('/new')}>
		<Icon icon="fa-solid:plus" />
		Add App
	</Button>
	<div slot="body" class="grid gap-4 grid-cols-1 mx-auto md:grid-cols-2 xl:grid-cols-3">
		{#each apps as app}
			<AppCard {...app} />
		{:else}
			<p>You don't have any app yet</p>
		{/each}
	</div>
</Page>
