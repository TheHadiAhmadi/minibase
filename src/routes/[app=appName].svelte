<script context="module">
	import { del, get, post, put } from '$lib/api';

	export async function load({ params }) {
		const result = await get(`/${params.app}.json`);

		return {
			props: {
				status: result.status ?? 200,
				message: result.message ?? 'ok',
				apiKeys: result.data?.apiKeys ?? [],
				tables: result.data?.tables ?? [],
				access: result.data?.access ?? false
			},
			stuff: {
				apiKeys: result.data?.apiKeys ?? []
			}
		};
	}
</script>

<script>
	import { page } from '$app/stores';
	import { Button, Icon, Modal } from '@svind/svelte';
	import { ApiKeyEditor, TableCard, Page, TableEditorForm } from '$lib/components';

	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import Error from '$lib/components/Error.svelte';
	import { ButtonList } from '@svind/svelte';

	let model = {};
	let editingTableName;
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
		console.log('Load Tables');
		tables = (await get(`/${app}.json`)).data.tables;
	}

	async function add({ detail }) {
		console.log(detail);
		await post(`/${app}.json`, detail);
		loadTables();
		cancel();
	}

	async function update({ detail }) {
		await put(`/${app}/${editingTableName}.json`, detail);
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
		editingTableName = table.name;
	}

	async function removeTable(table) {
		await del(`/${app}/${table.name}.json`);
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
	<Page full title="Tables">
		<ButtonList slot="actions">
			<Button size="sm" on:click={openApiKeys}>
				<Icon icon="fa-solid:key" />
				Api Keys
			</Button>

			<Button variant="primary" size="sm" on:click={addTable}>
				<Icon icon="fa-solid:plus" />
				Add
			</Button>
		</ButtonList>

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

<Modal bind:open={addModalOpen}>
	<TableEditorForm title="Add Table" on:submit={add} on:cancel={cancel} />
</Modal>

<Modal bind:open={updateModalOpen}>
	<TableEditorForm
		title="Edit Title"
		bind:name={model.name}
		bind:rows={model.rows}
		bind:public={model.public}
		on:submit={update}
		on:cancel={cancel}
	/>
</Modal>

<Modal bind:open={apiKeysModalOpen}>
	<ApiKeyEditor {apiKeys} />
</Modal>
