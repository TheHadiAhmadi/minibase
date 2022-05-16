<script>
	// Divider,
	import { Button, FormGroup, Dropdown, Menu, Icon, Input, Label, Col, Row } from '@svind/svelte';

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
	<Label for="">Rows</Label>
	<hr class="my-2" />
	<Row>
		{#each rows as row}
			{@const disabled = row.name === 'id'}

			<Row class="w-full">
				<Col col="expand">
					<Input variant="secondary" size="sm" {disabled} placeholder="field name..." bind:value={row.name} />
				</Col>
				<Col class="flex items-center justify-center" col=auto>

					<Dropdown position="top" align="end" autoClose>
						<Button {disabled}  slot="target">
							{row.type}
						</Button>
						{#if !disabled}
						<Menu>
							{#each rowTypes as type}
							<li class="menu-item" on:click={() => (row.type = type)}>{type}</li>
							{/each}
						</Menu>
						{/if}
					</Dropdown>
				</Col>
				<Col class="flex justify-center items-center" col="auto">
					<Button
						size="xs"
						outline
						circle
						{disabled}
						variant="error"
						on:click={() => (rows = rows.filter((r) => r !== row))}
					>
						<Icon icon="fa-solid:times" />
					</Button>
				</Col>

			</Row>
		{/each}
		<Col class="mt-2" col=12>
			<Button block variant="info" on:click={addRow} size="sm">
				<Icon icon="fa-solid:plus" />
				Add
			</Button>
		</Col>
	</Row>
</FormGroup>
