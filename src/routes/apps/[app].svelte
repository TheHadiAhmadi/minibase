<script>
	import { TableEditorForm, ApiKeyEditor } from '$lib/components';

	import { invalidate } from '$app/navigation';

	import { page, session } from '$app/stores';
	import { del, get, post, put } from '$lib/api';
	import { title } from '$lib/stores';

	import {
		Button,
		Checkbox,
		Dropdown,
		Link,
		Table,
		TableRow,
		Cell,
		TableHeader,
		Menu,
		MenuItem,
		TabContent,
		TabPane,
		Card,
		CardTitle,
		Icon,
		Modal,
		FormGroup,
		Input,
		ModalActions,
		Label,
		CardBody
	} from '@ubeac/svelte-components';
	import { Page } from '$lib/components';
	import { onMount } from 'svelte';
	import { showAlert } from '$lib/errors';

	let apiKeys = [];
	let tables = [];
	let access = false;

	let app_name = $page.params.app;

	async function loadTables() {
		console.log('loadTables()');
		const result = await get(`/apps/${app_name}.json`);

		console.log({ result });
		if (result.status >= 400) {
			showAlert(result.message, 'error');
		}
		apiKeys = result.apiKeys;
		tables = result.tables;
		access = result.access;
	}

	onMount(() => {
		loadTables();
		title.set(app_name);
	});

	let editTableName = '';

	let editingTable = {
		rows: [],
		public: true
	};

	let modalOpen = false;

	async function submit() {
		modalOpen = false;

		if (editTableName) {
			// update table
			const result = await put(
				'/apps/' + $page.params.app + '/' + editTableName + '.json',
				editingTable
			);
			console.log('Update successfully', result);
		} else {
			// create new table
			const result = await post('/apps/' + $page.params.app + '.json', editingTable);
			console.log(result);
		}
		loadTables();
	}
	async function cancel() {
		modalOpen = false;
	}

	const rowTypes = ['string', 'number', 'boolean', 'object', 'array'];

	function addRow() {
		editingTable.rows = [...(editingTable.rows ?? []), { name: '', type: rowTypes[0] }];
	}

	function addTable() {
		modalOpen = true;
		editingTable = {
			public: true,
			rows: [],
			name: ''
		};
	}

	function updateTable(table) {
		editTableName = table.name;
		modalOpen = true;
		editingTable = table;
		loadTables();
	}

	async function removeTable(table) {
		console.log('prompt before delete');
		const result = await del('/' + $page.params.app + '/' + table.name);
		console.log('Delete', result);
		loadTables();
	}
</script>

<TabContent class="p-0" boxed>
	<TabPane class="p-0" name="Data">
		<Page title="{app_name} / Tables">
			<svelte:fragment slot="actions">
				{#if access}
					<Button size="sm" circle on:click={addTable}>
						<Icon icon="fa-solid:plus" />
					</Button>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="body">
				{#each tables as table}
					<div
						class="p-4 mt-2 shadow-lg flex items-center justify-between rounded-lg bg-info border border-info border-opacity-25 shadow bg-opacity-10 "
					>
						<a sveltekit:prefetch href="./{app_name}/{table.name}">{table.name}</a>
						<div class="flex space-x-1">
							{#if access}
								<Button on:click={() => updateTable(table)} size="xs" square variant="info">
									<Icon size="sm" icon="fa-solid:edit" />
								</Button>
								<Button on:click={() => removeTable(table)} size="xs" square variant="error">
									<Icon size="sm" icon="fa-solid:trash-alt" />
								</Button>
							{/if}
						</div>
					</div>
				{/each}
			</svelte:fragment>
		</Page>
	</TabPane>

	{#if $session}
		<TabPane class="p-0" name="settings">
			<Page title="{app_name} / Settings">
				<svelte:fragment slot="body">
					{#if access}
						<ApiKeyEditor {apiKeys} />
					{:else}
						<p>You don't have access to read/manage ApiKeys</p>
					{/if}
				</svelte:fragment>
			</Page>
		</TabPane>
	{/if}
</TabContent>

<Modal bind:open={modalOpen}>
	<TableEditorForm />
	<ModalActions end class="mt-4">
		<Button size="sm" variant="ghost" on:click={cancel}>Cancel</Button>
		<Button size="sm" on:click={submit}>Submit</Button>
	</ModalActions>
</Modal>
