<script>
	// Divider,
	// Dropdown,
	// Menu

	import { Button, FormGroup, Icon, Input, Label } from '@svind/svelte';

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
			<!-- <Dropdown position="top" end>
				<Button size="sm" variant="ghost" class="w-24 border border-base-300" slot="title">
					{row.type}
				</Button>
				<Menu shadow class="bg-base-200 border border-base-300">
					{#each rowTypes as type}
						<li on:click={() => (row.type = type)}>
							<a on:click|preventDefault href="/" class="!py-1">{type}</a>
						</li>
					{/each}
				</Menu>
			</Dropdown> -->
		</div>
	{/each}
</FormGroup>
