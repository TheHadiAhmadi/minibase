<script>
	import {
		Button,
		Divider,
		Dropdown,
		FormGroup,
		Icon,
		Input,
		Label,
		Menu
	} from '@ubeac/svelte-components';

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
	<Label class="flex py-2 items-center justify-between">
		Rows
		<Button on:click={addRow} size="sm" circle>
			<Icon icon="fa-solid:plus" />
		</Button>
	</Label>
	{#each rows as row}
		<div class="flex items-center gap-2 mt-1">
			<Button
				size="xs"
				square
				variant="error"
				on:click={() => (rows = rows.filter((r) => r !== row))}
			>
				<Icon variant="error" icon="fa-solid:times" />
			</Button>
			<Input shadow size="sm" placeholder="field name..." bind:value={row.name} />
			<Dropdown position="top" end>
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
			</Dropdown>
		</div>
	{/each}
</FormGroup>
