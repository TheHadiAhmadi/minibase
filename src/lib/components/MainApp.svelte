<!-- <script context="module">
	export async function load({ stuff }) {
		console.log({ stuff });
		return {
			props: {
				tables: stuff.tables,
				apiKeys: stuff.apiKeys,
				access: stuff.access
			}
		};
	}
</script> -->

<script>
	import { page } from '$app/stores';
	import { Button, Icon, Modal } from '@svind/svelte';
	import { ApiKeyEditor, TableCard, Page, TableEditorForm } from '$lib/components';


	import { ButtonList } from '@svind/svelte';
	import { invalidate } from '$app/navigation';
import { apiAddTable, apiRemoveTable } from '../api';

	export let appName = ''
	export let tables = [];
	export let apiKeys = [];
	export let access = true;

	$: console.log({tables})
	
	let model = {};
	let editingTableName;
	let app = $page.params.app;

	let updateModalOpen = false;
	let addModalOpen = false;
	let apiKeysModalOpen = false;

	async function loadTables() {
		invalidate(`/`);
	}

	async function add({ detail }) {
		await apiAddTable(appName, detail)
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
		console.log('updateTable', table, table.name);
	}

	async function removeTable(table) {
		await apiRemoveTable(appName, table.name)
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
	$: console.log({ apiKeys });
</script>

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
		{:else}
			This App doesn't have any table yet
		{/each}
	</svelte:fragment>
</Page>

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
