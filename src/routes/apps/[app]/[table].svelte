<script context="module">
	export async function load({ fetch, page, session, stuff }) {
		const { app, table } = page.params;

		const tables = await fetch(`/api/${app}/${table}`).then((res) => res.json());
		const schema = (await fetch(`/api/${app}`).then((res) => res.json())).schema;

		console.log(tables);

		return {
			props: {
				tables,
				table_name: table,
				schema
			},
			status: 200
		};
	}
</script>

<script>
	import { Card, CardTitle, Cell, Table, TableHeader } from '@ubeac/svelte-components';

	export let table_name;
	export let tables;
	export let schema;

	let draft = {};
</script>

<Card compact>
	<CardTitle slot="title">data of {table_name}</CardTitle>

	{JSON.stringify(schema)}

	{#each tables as table}
		<div>{JSON.stringify(table)}</div>
	{/each}
</Card>
