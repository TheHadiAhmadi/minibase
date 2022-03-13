<script context="module">
	import { del, get, post, put } from '$lib/api';

	export async function load({ params }) {
		const result = await get(`/apps/${params.app}.json`);

		return {
			props: {
				status: result.status ?? 200,
				message: result.message ?? 'ok',
				apiKeys: result.data?.apiKeys ?? [],
				tables: result.data?.tables ?? [],
				access: result.data?.access ?? false
			}
		};
	}
</script>

<script>
	import { page } from '$app/stores';
	import { Button, Icon, Modal } from '@ubeac/svelte-components';
	import { ApiKeyEditor, TableCard, Page, TableEditorForm } from '$lib/components';

	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import Error from '$lib/components/Error.svelte';

	let model = {};
	let app = $page.params.app;

	export let status;
	export let message;

	export let access = true;
	export let tables = [];
	export let apiKeys = [];

	let updateModalOpen = false;
	let addModalOpen = false;
	let apiKeysModalOpen = false;

	async function loadTables() {
		invalidate(`/apps/${app}`);
	}

	async function add({ detail }) {
		console.log(detail);
		await post(`/apps/${app}.json`, detail);
		loadTables();
		cancel();
	}

	async function update({ detail }) {
		await put(`/apps/${app}/${detail.name}.json`, detail);
		loadTables();
		cancel();
	}

	function openApiKeys() {
		apiKeysModalOpen = true;
	}

	function cancel() {
		updateModalOpen = false;
		addModalOpen = false;
	}

	function updateTable(table) {
		model = table;
		updateModalOpen = true;
	}

	async function removeTable(table) {
		await del(`/apps/${app}/${table.name}.json`);
		loadTables();
	}
	function addTable() {
		model = {
			name: '',
			public: false,
			rows: []
		};
		addModalOpen = true;
	}

	onMount(() => {
		loadTables();
	});
</script>

{#if status !== 200}
	<Error {status} {message} />
{:else}
	<Page title="Tables">
		<svelte:fragment slot="actions">
			<Button class="mr-2 border border-base-300" variant="ghost" size="sm" on:click={openApiKeys}>
				<Icon slot="prefix" class="mr-2" icon="fa-solid:key" />
				Api Keys
			</Button>

			<Button size="sm" on:click={addTable}>
				<Icon slot="prefix" class="mr-2" icon="fa-solid:plus" />
				Add
			</Button>
		</svelte:fragment>
		<svelte:fragment slot="body">
			{#each tables as table}
				<TableCard
					{app}
					{table}
					{access}
					on:update={() => updateTable(table)}
					on:remove={() => removeTable(table)}
				/>
			{/each}
		</svelte:fragment>
	</Page>
{/if}

<Modal class="p-0" bind:open={addModalOpen}>
	<TableEditorForm title="Add Table" on:submit={add} on:cancel={cancel} />
</Modal>

<Modal class="p-0" bind:open={updateModalOpen}>
	<TableEditorForm
		title="Edit Title"
		bind:name={model.name}
		bind:rows={model.rows}
		bind:public={model.public}
		on:submit={update}
		on:cancel={cancel}
	/>
</Modal>

<Modal class="p-0" bind:open={apiKeysModalOpen}>
	<ApiKeyEditor {apiKeys} />
</Modal>
