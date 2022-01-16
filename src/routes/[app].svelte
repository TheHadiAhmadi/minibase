<script>
	import { invalidate, prefetchRoutes } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from '$lib/api';
	import { baseUrl } from '$lib/helpers';
	import sidebar from '$lib/sidebar';
	import title from '$lib/title';

	import { Button, Link } from '@ubeac/svelte-components';

	import {
		Table,
		TableRow,
		Cell,
		TableHeader,
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
		const result = await get('/' + $page.params.app);
		console.log(result);
		tables = result?.data;
	}
	loadTables();
	let tables = [
		// { id: 'ds', name: 'sdkl', rows: { id: 'string', title: 'string', completed: 'boolean' } },
		// {
		// 	id: 'ds2',
		// 	name: 'sdkl3',
		// 	rows: { id: 'string', name: 'string', salary: 'number', age: 'number' }
		// }
	];

	let app_name = $page.params.app;

	let newTable = {};
	let newRow = '';
	let modalOpen = false;

	// onMount(async () => {
	// 	const result = await prefetchRoutes();
	// 	console.log('prefetch', result);
	// });

	async function submit() {
		const result = await fetch(baseUrl + `/api/${app_name}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: newTable.name, rows: newTable.rows ?? [] })
		}).then((res) => res.json());

		console.log('add Table: ', result);
		if (result.acknowledged) {
			await invalidate(`/api/${app_name}`);
			newTable.name = '';
			newTable.rows = [];
		}
	}

	function addRow() {
		newTable.rows = newTable.rows ?? [];
		newTable.rows.push(newRow);
	}

	function addTable() {
		console.log('open modal');
	}

	onMount(() => {
		title.set(app_name);
		sidebar.set({
			title: 'Tables of ' + app_name,
			items: tables
		});
	});
</script>

<div>
	<TabContent lifted>
		<TabPane name="Data">
			<Card compact>
				<CardTitle slot="title" class="flex items-center justify-between">
					Tables
					<Button
						size="sm"
						compact
						circle
						on:click={() => {
							console.log('adding');
							adding = true;
						}}
					>
						<Icon name="fas-plus" />
					</Button>
				</CardTitle>
				{#each tables as table}
					<div
						class="p-4 mt-2 shadow-lg flex items-center justify-between rounded-lg bg-info bg-opacity-30"
					>
						{#if table.rows.length > 0}
							<Icon name="fas-check" />
						{/if}
						<a sveltekit:prefetch href="./{app_name}/{table.name}">{table.name}</a>
						<div class="flex space-x-1">
							<Button size="sm" compact variant="info">
								<Icon name="fas-edit" />
							</Button>
							<Button size="sm" compact variant="error">
								<Icon name="fas-trash-alt" />
							</Button>
						</div>
					</div>
				{/each}
			</Card>
		</TabPane>
		<TabPane name="settings">Settings</TabPane>
	</TabContent>
</div>

<div>Modal</div>
<Modal open={modalOpen}>
	<Input bordered placeholder="New Table" shadow bind:value={newTable.name} />
	<!-- <Card compact class="mt-2">
		{#each newTable.rows ?? [] as row}
			<div>{row}</div>
		{/each}
		<FormGroup>
			<Label>row</Label>
			<div class="flex space-x-2">
				<Input bind:value={newRow} shadow bordered class="w-full focus:shadow-lg" />
				<Button on:click={addRow} variant="neutral">Add</Button>
			</div>
		</FormGroup>
		<Button shadow on:click={submit}>Add</Button>
	</Card> -->
</Modal>
