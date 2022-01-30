<script>
	import { page, session } from '$app/stores';
	import ApiKeyEditor from '$components/ApiKeyEditor.svelte';
	import { del, get, post, put } from '$lib/api';
	import sidebar from '$lib/sidebar';
	import title from '$lib/title';

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
		Label
	} from '@ubeac/svelte-components';
	import { onMount } from 'svelte';

	async function loadTables() {
		try {
			const result = await get('/' + $page.params.app);
			console.log(result);
			tables = result?.data.tables ?? [];
			apiKeys = result?.data.apiKeys ?? [];
		} catch (err) {
			console.log(err);
		}
	}

	loadTables();

	let apiKeys = [];
	let tables = [];

	let app_name = $page.params.app;

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
			const result = await put('/' + $page.params.app + '/' + editTableName, editingTable);
			console.log('Update successfully', result);
		} else {
			// create new table
			const result = await post('/' + $page.params.app, editingTable);
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

	onMount(() => {
		title.set(app_name);
	});
</script>

<div>
	<TabContent lifted>
		<TabPane name="Data">
			<Card>
				<CardTitle slot="title" class="flex items-center justify-between">
					Tables
					{#if $session}
						<Button size="sm" circle on:click={addTable}>
							<Icon name="fas-plus" />
						</Button>
					{/if}
				</CardTitle>
				{#each tables as table}
					<div
						class="p-4 mt-2 shadow-lg flex items-center justify-between rounded-lg bg-info border border-info border-opacity-25 shadow bg-opacity-10 "
					>
						<a sveltekit:prefetch href="./{app_name}/{table.name}">{table.name}</a>
						<div class="flex space-x-1">
							{#if $session}
								<Button on:click={() => updateTable(table)} size="xs" square variant="info">
									<Icon size="sm" name="fas-edit" />
								</Button>
								<Button on:click={() => removeTable(table)} size="xs" square variant="error">
									<Icon size="sm" name="fas-trash-alt" />
								</Button>
							{/if}
						</div>
					</div>
				{/each}
			</Card>
		</TabPane>
		{#if $session}
			<TabPane name="settings">
				<ApiKeyEditor {apiKeys}/>
			</TabPane>
		{/if}
	</TabContent>
</div>

<Modal bind:open={modalOpen}>
	<FormGroup>
		<Label>Table Name</Label>
		<Input bordered shadow bind:value={editingTable.name} />
	</FormGroup>
	<Checkbox class="mt-2" bind:checked={editingTable.public}>Public</Checkbox>

	<FormGroup class="">
		<div class="flex items-center justify-between">
			<Label>Rows</Label>
			<Button on:click={addRow} compact size="xs" circle>
				<Icon name="fas-plus" />
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
						<Icon variant="error" name="fas-times" />
					</Button>
					<Input shadow size="sm" bind:value={row.name} />
					<Dropdown position="top" end>
						<Button size="sm" variant="ghost" slot="title">{row.type}</Button>
						<Menu class="bg-base-300">
							{#each rowTypes as type}
								<li on:click={() => (row.type = type)}><a class="!py-1">{type}</a></li>
							{/each}
						</Menu>
					</Dropdown>
				</div>
			{/each}
		{/if}
	</FormGroup>

	<ModalActions end class="mt-4">
		<Button size="sm" variant="ghost" on:click={cancel}>Cancel</Button>
		<Button size="sm" on:click={submit}>Submit</Button>
	</ModalActions>
</Modal>
