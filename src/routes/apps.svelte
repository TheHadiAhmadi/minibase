<script context="module">
	import user from '$lib/stores/user';
	import { get_store_value } from 'svelte/internal';

	export async function load({ fetch, page }) {
		console.log(get_store_value(user));

		return {
			props: {
				apps: await fetch('/api').then((res) => res.json())
			}
		};
	}
</script>

<script>
	import { Card, CardTitle, Link } from '@ubeac/svelte-components';

	import { goto } from '$app/navigation';

	export let apps = [];
</script>

<div class="flex justify-between items-center w-full p-2 pt-8">
	<div class="font-semibold text-xl items-baseline px-4">Apps</div>
	<button class="btn border border-blue-300 " on:click={() => goto('/new')}>
		Create New App
	</button>
</div>

<div class="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each apps as app}
		<Card compact shadow bordered class="h-40 bg-base-100">
			<CardTitle>
				<a sveltekit:prefetch href="/apps/{app.name}">{app.name}</a>
			</CardTitle>
			{app.description}
		</Card>
	{/each}
</div>

<!-- <div>{$user.id}</div> 
    <div>{$user.email}</div>
    <div>{$user.user_metadata.full_name}</div>
    <div>{$user.user_metadata.user_name}</div>
    <div>{$user.user_metadata.avatar_url}</div> -->
