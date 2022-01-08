<script context="module">
	export async function load({ params, fetch }) {
		return {
			props: {
				tables: await fetch(`/api/${params.app}`).then((res) => res.json()),
				app_name: params.app
			}
		};
	}
</script>

<script>
	import { invalidate, prefetchRoutes } from '$app/navigation';
	import { baseUrl } from '$lib/helpers';

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

	export let tables;
	export let app_name;

	let newTable = {};
	let newRow = '';

	onMount(async () => {
		const result = await prefetchRoutes();
		console.log('prefetch', result);
	});
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
</script>

<div>
	<TabContent lifted>
		<TabPane name="Data">
			<Card compact>
				<CardTitle slot="title">Tables</CardTitle>
				{#each tables as table}
					<div
						class="p-4 mt-2 shadow-lg flex items-center justify-between rounded-lg bg-blue-100 border border-blue-400"
					>
						{#if table.rows.length > 0}
							<Icon name="fas-check" />
						{/if}
						<a sveltekit:prefetch href="./{app_name}/{table.name}">{table.name}</a>
						<div class="flex space-x-1">
							<Button size="sm">Open</Button>
							<Button size="sm" compact variant="error">
								<Icon name="fas-trash-alt" />
							</Button>
						</div>
					</div>
				{/each}
				<div class="flex mt-4 pt-4 border-t border-dashed border-gray-200 space-x-2">
					<Input bordered placeholder="New Table" shadow bind:value={newTable.name} />
				</div>
				{#if newTable.name}
					<Card compact class="mt-2">
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
					</Card>
				{/if}
			</Card>
		</TabPane>
		<TabPane name="settings">Settings</TabPane>
	</TabContent>
</div>
