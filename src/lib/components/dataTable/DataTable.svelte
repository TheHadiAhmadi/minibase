<script>
	import { Button, ButtonList, Card, Icon, Modal } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	import RowEditor from './RowEditor.svelte';
	import { Table, TableBody, TableCell, TableHead, TableRow } from '../table';

	let rowEditorOpen = false;
	let model = {};
	let updatingRow = null;

	export let rows = [];
	export let columns = [];

	function insert() {
		model = {};
		updatingRow = null;
		rowEditorOpen = true;
	}

	function update(row) {
		updatingRow = row;
		model = row;
		rowEditorOpen = true;
	}

	const dispatch = createEventDispatcher();
	function submit({ detail }) {
		if (updatingRow) {
			rows = rows.map((v) => (v === updatingRow ? model : v));
			dispatch('update', detail);
		} else {
			rows = [...rows, detail];
			dispatch('insert', detail);
		}
		rowEditorOpen = false;
	}

	function cancel() {
		updatingRow = null;
		model = {};
		rowEditorOpen = false;
	}

	function remove(row) {
		rows = rows.filter((v) => v !== row);
		dispatch('remove', row);
	}
</script>

<Card class="flex flex-col max-h-500px">
	<Table>
		<TableHead>
			{#each columns as column}
				<TableCell>{column.name}</TableCell>
			{/each}
			<TableCell class="w-0">Actions</TableCell>
		</TableHead>
		<TableBody>
			{#each rows as row}
				<TableRow>
					{#each columns as column}
						<TableCell>{row[column.name]}</TableCell>
					{/each}
					<TableCell class="w-0">
						<ButtonList>
							<Button on:click={() => update(row)} variant="info" square size="xs">
								<Icon icon="fa-solid:edit" />
							</Button>

							<Button on:click={() => remove(row)} variant="error" square size="xs">
								<Icon icon="fa-solid:trash" />
							</Button>
						</ButtonList>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
	<Button on:click={insert} block>
		<Icon icon="fa-solid:plus" />
		Click to Add new Row
	</Button>
</Card>

<Modal bind:open={rowEditorOpen}>
	<RowEditor {columns} value={model} on:submit={submit} on:cancel={cancel} />
</Modal>
