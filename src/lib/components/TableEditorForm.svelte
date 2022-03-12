<script>
	import { invalidate } from '$app/navigation';

	import { page } from '$app/stores';
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

<Page title="Add Table">
	<CardBody>
		<FormGroup>
			<Label>Table Name</Label>
			<Input bordered shadow bind:value={editingTable.name} />
		</FormGroup>
		<div class="h-2" />
		<Checkbox bind:checked={editingTable.public}>Public</Checkbox>

		<div class="flex items-center justify-between">
			<Label>Rows</Label>
			<Button on:click={addRow} compact size="xs" circle>
				<Icon icon="fa-solid:plus" />
			</Button>
		</div>
		{#if editingTable.rows}
			{#each editingTable.rows as row, index}
				<div class="flex items-center gap-2 mt-1">
					<Button
						size="xs"
						square
						variant="error"
						on:click={() => (editingTable.rows = editingTable.rows.filter((row, i) => i !== index))}
					>
						<Icon variant="error" icon="fa-solid:times" />
					</Button>
					<Input shadow size="sm" placeholder="field name..." bind:value={row.name} />
					<Dropdown position="top" end>
						<Button size="sm" variant="ghost" class="w-20 border border-base-300" slot="title"
							>{row.type}</Button
						>
						<Menu shadow class="bg-base-200 border border-base-300">
							{#each rowTypes as type}
								<li on:click={() => (row.type = type)}>
									<a on:click|preventDefault href="/" class="!py-1">{type}</a>
								</li>
							{/each}
						</Menu>
					</Dropdown>
				</div>
			{/each}
		{/if}
	</CardBody>
</Page>
