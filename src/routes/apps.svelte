<script context="module">
	export async function load({ stuff }) {
		return {
			props: {
				something: stuff.something,
				apps: await get('/')
			}
		};
	}
</script>

<script>
	import { AppCard } from '$components';
	import { get } from '$lib/api';
	export let apps = [];
</script>

<!-- 
<svelte:fragment slot="sidebar">
	{#each apps as app}
		{app}
	{/each}
</svelte:fragment> -->
<!-- <div class="flex justify-between items-center w-full p-2">
	<div class="font-semibold text-xl items-baseline px-4">Apps</div>
	<button class="btn border border-blue-300 " on:click={() => goto('/new')}>
		Create New App
	</button>
</div> -->

<div class="p-4 grid gap-4 grid-cols-1 mx-auto md:grid-cols-2 xl:grid-cols-3">
	{#each apps as app}
		<AppCard name={app.name} description={app.description} />
		<!-- {:else} -->
		<!-- <div class="relative w-full h-full flex items-center justify-center">
			<div class="absolute">Loading...</div>
			<Spinner />
		</div> -->
	{/each}
</div>
