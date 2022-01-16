<script context="module">
	export async function load({ stuff }) {
		return {
			props: {
				apps: await get('/').then(console.log)
			}
		};
	}
</script>

<script>
	import { AppCard } from '$components';
	import { get } from '$lib/api';
	import sidebar from '$lib/sidebar';
	import title from '$lib/title';
	import { onMount } from 'svelte';
	export let apps = [];

	$: console.log({ apps });
	onMount(() => {
		$title = 'apps';
		$sidebar = {
			title: 'apps',
			items: apps.map((app) => ({ href: '/' + app.name, name: app.name }))
		};
	});
</script>

<div class="p-4 grid gap-4 grid-cols-1 mx-auto md:grid-cols-2 xl:grid-cols-3">
	{#each apps as app}
		<AppCard name={app.name} description={app.description} />
	{/each}
</div>
