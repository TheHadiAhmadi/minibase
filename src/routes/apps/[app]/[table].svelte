<script context="module">
	import { get } from '$lib/api';

	import { baseUrl } from '$lib/helpers';

	export async function load({ fetch, params, session, stuff }) {
		const { app, table } = params;

		const tables = await get(`/${app}/${table}`);
		const allTables = await get(`/${app}`);

		return {
			props: {
				tables,
				table_name: table,
				rows: allTables.find((tabl) => tabl.name === table).rows ?? []
			},
			status: 200
		};
	}
</script>

<script>
	import {
		Button,
		Card,
		CardTitle,
		Cell,
		FormGroup,
		Icon,
		Input,
		Label,
		Modal,
		Table,
		TableHeader,
		TableRow
	} from '@ubeac/svelte-components';
	import { insert } from 'svelte/internal';

	export let table_name = '';
	export let tables = [];
	export let rows = [];

	let insertMode = false;
	let inserting = {};
</script>

<Card compact>
	<CardTitle class="flex items-center justify-between" slot="title">
		<div>data of {table_name}</div>
		<Button on:click={() => (insertMode = true)} circle compact size="sm">
			<Icon name="fas-plus" />
		</Button>
	</CardTitle>

	{JSON.stringify(rows)}
	<Table>
		<TableHeader>
			{#each rows as row}
				<Cell>{row}</Cell>
			{/each}
			<Cell>Actions</Cell>
		</TableHeader>

		{#each tables as table}
			<TableRow>
				{#each rows as row}
					<Cell>{table[row]}</Cell>
				{/each}
				<Cell>
					<Button>Update</Button>
					<Button>Delete</Button>
				</Cell>
			</TableRow>
		{/each}
		{#if insertMode}
			<Modal bind:open={insertMode}>
				<!-- <TableRow class="space-x-2"> -->
				{#each rows as row}
					<!-- <Cell> -->
					<FormGroup>
						<Label>{row}</Label>
						<Input bordered shadow size="sm" bind:value={inserting[row]} />
					</FormGroup>
					<!-- </Cell> -->
				{/each}
				<!-- <Cell> -->
				<Button>Add</Button>
				<!-- </Cell> -->
				<!-- </TableRow> -->
			</Modal>
		{/if}
	</Table>
</Card>
