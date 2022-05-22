<script context="module">
	export async function load({ fetch }) {
		const response = await fetch('/.json').then((res) => res.json());
		return {
			props: {
				apps: response.apps
			}
		};
	}
</script>

<script>
	import { AppCard, NewAppForm, Page } from '$lib/components';
	import { Button, Icon } from '@svind/svelte';
	import Modal from '@svind/svelte/components/modal/Modal.svelte';
	import { showSuccess } from '$lib/alerts';
	import { session } from '$app/stores';
	import { invalidate } from '$app/navigation';

	export let apps = [];

	let newAppModalOpen = false;
	let loading = false;

	async function loadApps() {
		invalidate('/.json');
	}

	function openNewAppModal() {
		newAppModalOpen = true;
	}

	async function newAppAdded({ detail }) {
		showSuccess(detail.message, 'success');

		await loadApps();
		loading = false;

		newAppModalOpen = false;
	}

	// onMount(() => {
	// 	loadApps();
	// });
</script>

{#if $session.user}
	<Page full title="Apps">
		<Button size="sm" slot="actions" on:click={openNewAppModal}>
			<Icon icon="fa-solid:plus" />
			Add App
		</Button>
		<div class="card-body grid gap-4 grid-cols-1 mx-auto md:grid-cols-2 xl:grid-cols-3">
			{#each apps as app}
				<AppCard {...app} />
			{:else}
				<p>You don't have any app yet</p>
			{/each}
		</div>
	</Page>
{:else}
	<div class="w-full pt-32 flex items-end justify-center">You are not logged in yet.</div>
{/if}

<Modal bind:open={newAppModalOpen}>
	<NewAppForm bind:loading on:success={newAppAdded} on:error={console.log} />
</Modal>
