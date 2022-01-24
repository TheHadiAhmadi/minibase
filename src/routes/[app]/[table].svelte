<!-- <script context="module" lang="ts">
	import { get } from '$lib/api';

	import { baseUrl } from '$lib/helpers';

	export async function load({ fetch, params, session, stuff }) {
		const { app, table } = params;

		const tables = await get<{ data: any[] }>(`/${app}/${table}`).then(({ data }) => data);
		const allTables = await get<{ data: any[] }>(`/${app}`).then(({ data }) => data);

		return {
			props: {
				tables,
				table_name: table,
				rows: allTables.find((tabl) => tabl.name === table).rows ?? []
			},
			status: 200
		};
	}
</script> -->
<script>
	import { page, session } from '$app/stores';

	import {
		Button,
		Card,
		CardTitle,
		Cell,
		Checkbox,
		FormGroup,
		Icon,
		Input,
		Label,
		Link,
		Modal,
		ModalActions,
		Table,
		TableHeader,
		TableRow,
		TextArea,
		Toggle
	} from '@ubeac/svelte-components';
	import { onMount } from 'svelte/internal';
	import { get } from '$lib/api';
	import { baseUrl } from '$lib';
	// import { path } from '$app/navigation';

	let apiKey = '';

	let api = {
		get: async (url) => {
			return await fetch(baseUrl + url, {
				headers: {
					'Content-Type': 'application/json',
					apiKey: apiKey
				}
			}).then((res) => res.json());
		},
		post: async (url, data) => {
			return await fetch(baseUrl + url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					apiKey: apiKey
				},
				body: JSON.stringify(data)
			}).then((res) => res.json());
		},
		put: async (url, data) => {
			return await fetch(baseUrl + url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					apiKey: apiKey
				},
				body: JSON.stringify(data)
			}).then((res) => res.json());
		},
		del: async (url, data) => {
			return await fetch(baseUrl + url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					apiKey: apiKey
				}
			}).then((res) => res.json());
		}
	};

	let data = [];
	let rows = [];

	let editDataId = '';
	let modalOpen = false;
	let editingData = {};

	async function submit() {
		modalOpen = false;
		if (editDataId) {
			const result = await api.put(
				`/${$page.params.app}/${$page.params.table}/${editDataId}`,
				editingData
			);
			console.log(result);
			// put
		} else {
			const result = await api.post(`/${$page.params.app}/${$page.params.table}`, editingData);

			console.log(result);
		}

		loadData();
	}
	async function cancel() {
		modalOpen = false;
		console.log('cancel	');
	}

	async function loadApp() {
		const result = await get('/' + $page.params.app);
		apiKey = result.data.apiKey ?? '';
		rows = result.data.tables.find((table) => table.name === $page.params.table).rows;
	}

	async function loadData() {
		const result = await api.get(`/${$page.params.app}/${$page.params.table}`);
		data = result.data;
	}

	function insert() {
		modalOpen = true;
		editingData = {};

		rows.map((row) => {
			editingData[row.name] = '';
		});
	}

	function edit(data) {
		modalOpen = true;
		editDataId = data.id;
		editingData = data;
	}

	async function remove(data) {
		const result = await api.del(`/${$page.params.app}/${$page.params.table}/${data.id}`);
		console.log(result);
	}

	onMount(async () => {
		await loadApp();

		loadData();
	});
</script>

<Card compact>
	<CardTitle class="flex items-center justify-between" slot="title">
		<h1>
			<Link href="/{$page.params.app}">{$page.params.app}</Link> / <Link>{$page.params.table}</Link>
		</h1>
		{#if $session}
			<Button on:click={insert} circle size="sm">
				<Icon name="fas-plus" />
			</Button>
		{/if}
	</CardTitle>

	<Table>
		<TableHeader>
			{#each rows as row}
				<Cell>{row.name}</Cell>
			{/each}
			{#if $session}
				<Cell>Actions</Cell>
			{/if}
		</TableHeader>

		{#each data as item}
			<TableRow>
				{#each rows as row}
					<Cell>{item[row.name]}</Cell>
				{/each}
				{#if $session}
					<Cell>
						<Button on:click={() => edit(item)} square size="xs" compact>
							<Icon size="sm" name="fas-edit" />
						</Button>
						<Button variant="error" on:click={() => remove(item)} square size="xs" compact>
							<Icon size="sm" name="fas-trash-alt" />
						</Button>
					</Cell>
				{/if}
			</TableRow>
		{/each}
	</Table>
</Card>

<Modal bind:open={modalOpen}>
	{#each rows as row}
		<FormGroup>
			<!-- TODO: create Object editor form (as another project) -->
			<!-- support all primary data types, file, uuid, ... by plugins -->
			{#if row.type === 'boolean'}
				<Checkbox bind:checked={editingData[row.name]}>Done</Checkbox>
			{:else if row.type === 'number'}
				<Label>{row.name}</Label>
				<Input type="number" bordered shadow size="sm" bind:value={editingData[row.name]} />
			{:else if row.type === 'array'}
				{#each editingData[row.name] as arrayItem}
					{JSON.stringify(arrayItem)}
				{/each}
			{:else if row.type === 'object'}
				<Label>{row.name}</Label>
				<TextArea class="h-32 " readonly value={JSON.stringify(editingData[row.name], null, 2)} />
			{:else}
				<Label>{row.name}</Label>
				<Input bordered shadow size="sm" bind:value={editingData[row.name]} />
			{/if}
		</FormGroup>
	{/each}

	<ModalActions end class="mt-2">
		<Button size="sm" on:click={cancel} variant="ghost">Cancel</Button>
		<Button size="sm" on:click={submit}>Submit</Button>
	</ModalActions>
</Modal>
