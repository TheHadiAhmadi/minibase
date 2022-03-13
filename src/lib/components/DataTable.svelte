<script>
	import { Button, Cell, Icon, Modal, Table, TableRow } from '@ubeac/svelte-components';
	import { createEventDispatcher } from 'svelte';
	import DataCell from './DataCell.svelte';
	import RowEditor from './RowEditor.svelte';

	export let rows;
	export let values;

	let updateModalOpen = false;
	let activeIndex = -1;

	function emptyData() {
		let data = {};
		let typeMapping = {
			string: '',
			number: 0,
			boolean: false,
			object: {},
			array: []
		};
		rows.forEach((row) => {
			data[row.name] = typeMapping[row.type];
		});
		return data;
	}

	function addData() {
		values = [...values, emptyData()];
		activeIndex = values.length - 1;
		updateModalOpen = true;
	}

	const dispatch = createEventDispatcher();

	function submit({ detail }) {
		values[activeIndex] = detail;

		if (detail.id) {
			dispatch('update', detail);
		} else {
			dispatch('create', detail);
		}

		activeIndex = -1;
		updateModalOpen = false;
	}

	function cancel() {
		updateModalOpen = false;
	}

	function update(index) {
		activeIndex = index;
		updateModalOpen = true;
	}

	function remove(index) {
		dispatch('remove', values[index]);
		values = values.filter((_, idx) => index !== idx);
	}
</script>

<Button on:click={addData} size="sm">
	<Icon class="mr-2" icon="fa-solid:plus" />
	Insert
</Button>
<Table>
	<svelte:fragment slot="header">
		{#each rows as row}
			<Cell>{row.name}</Cell>
		{/each}
		<Cell>Actions</Cell>
	</svelte:fragment>
	{#each values as value, index}
		<TableRow>
			{#each rows as row}
				<DataCell type={row.type} value={value[row.name]} />
			{/each}
			<Cell>
				<Button size="sm" circle on:click={() => update(index)}>
					<Icon icon="fa-solid:edit" />
				</Button>
				<Button size="sm" circle on:click={() => remove(index)}>
					<Icon icon="fa-solid:trash-alt" />
				</Button>
			</Cell>
		</TableRow>
	{/each}
</Table>

{#if activeIndex >= 0}
	<Modal class="p-0" bind:open={updateModalOpen}>
		<RowEditor {rows} value={values[activeIndex]} on:submit={submit} on:cancel={cancel} />
	</Modal>
{/if}
