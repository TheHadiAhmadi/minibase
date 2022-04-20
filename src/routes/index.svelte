<script>
	import { goto } from '$app/navigation';

	import { session } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		const sess = JSON.parse(localStorage.getItem('mb-session'));
		if (sess) $session = sess;
		if (sess) {
			loadApps();
		} else {
			// goto('/login');
		}
	});

	import { AppCard, NewAppForm, Page } from '$lib/components';
	import { get } from '$lib/api';
	import { sidebar } from '$lib/stores';
	import { Button, Icon } from '@svind/svelte';
	import Modal from '@svind/svelte/components/modal/Modal.svelte';
	import { showAlert } from '$lib/errors';

	let newAppModalOpen = false;
	let loading = false;
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

	function openNewAppModal() {
		newAppModalOpen = true;
	}

	async function newAppAdded({ detail }) {
		console.log('Detail: ', detail);

		showAlert(detail.message, 'success');

		await loadApps();
		loading = false;

		newAppModalOpen = false;
	}

	onMount(() => {
		loadApps();
	});
</script>

<Page full title="Apps">
	<Button size="sm" slot="actions" on:click={openNewAppModal}>
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

<Modal bind:open={newAppModalOpen}>
	<NewAppForm bind:loading on:success={newAppAdded} on:error={console.log} />
</Modal>
