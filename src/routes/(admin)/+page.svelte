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
	// import { session } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { DashboardLayout } from '$lib/layouts';
import AppCards from '$lib/components/AppCards.svelte';
import MainApp from '$lib/components/MainApp.svelte';

	export let data;

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
	onMount(() => invalidate());
</script>

<DashboardLayout user={data.user} dark={data.dark}>
	{#if data.appName}
		<MainApp appName={data.appName} apiKeys={data.apiKeys} tables={data.tables}/>
		{:else}
	<div class="flex flex-col gap-4 ">
		<AppCards apps={data.apps} title="Your Apps">
			<Button size="sm" slot="actions" on:click={openNewAppModal}>
				<Icon icon="fa-solid:plus" />
				Add App
			</Button>
		</AppCards>

		<AppCards title="Public Apps (readonly)" apps={data.publicApps}/>
	</div>
	{/if}
</DashboardLayout>

<Modal bind:open={newAppModalOpen}>
	<NewAppForm bind:loading on:success={newAppAdded} on:error={console.log} />
</Modal>
