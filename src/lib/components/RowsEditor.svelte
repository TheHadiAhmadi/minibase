<script>
	// Divider,
	// Dropdown,
	// Menu

	import { Button, FormGroup, Dropdown, Menu, Icon, Input, Label } from '@svind/svelte';

	export let rows;

	function addRow() {
		rows = [
			...rows,
			{
				type: 'string',
				name: ''
			}
		];
	}

	const rowTypes = ['string', 'number', 'boolean', 'object', 'array'];
</script>

<FormGroup>
	<div class="flex py-2 items-center justify-between">
		<Label for="">Rows</Label>
		<Button variant="primary" on:click={addRow} size="xs" circle>
			<Icon icon="fa-solid:plus" />
		</Button>
	</div>
	{#each rows as row}
		<div class="flex items-center gap-2 mt-1">
			<Button
				size="xs"
				square
				variant="error"
				on:click={() => (rows = rows.filter((r) => r !== row))}
			>
				<Icon icon="fa-solid:times" />
			</Button>
			<Input size="sm" placeholder="field name..." bind:value={row.name} />
			<Dropdown position="top" align="end" autoClose>
				<Button size="sm" variant="ghost" class="w-24 border border-base-300" slot="target">
					{row.type}
				</Button>
				<Menu>
					{#each rowTypes as type}
						<li class="menu-item" on:click={() => (row.type = type)}>{type}</li>
					{/each}
				</Menu>
			</Dropdown>
		</div>
	{/each}
</FormGroup>
