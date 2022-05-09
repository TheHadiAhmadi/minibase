<script>
	import { Button, Icon } from '@svind/svelte';
	import Modal from '@svind/svelte/components/modal/Modal.svelte';
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
	<Icon icon="fa-solid:plus" />
	Insert
</Button>
<!-- <div>Table TODO</div> -->
<table class="w-full">
	<thead>

		<tr>
		{#each rows as row}
			<th class="text-left px-4">{row.name}</th>
			{/each}
			<th class="text-left px-4 max-w-4">Actions</th>
		</tr>
	</thead>

	<tbody>
		{#each values as value, index}
		<tr class="border-b py-1 border-gray-300 dark:border-[#505050]">
			{#each rows as row}
				<DataCell type={row.type} value={value[row.name]} />
			{/each}
		<td class="max-w-4 flex py-2 gap-2">
			<Button variant="info" size="xs" square on:click={() => update(index)}>
				<Icon icon="fa-solid:edit" />
			</Button>
			<Button variant="error" size="xs" square on:click={() => remove(index)}>
				<Icon icon="fa-solid:trash-alt" />
			</Button>
		</td>
		</tr>
		{/each}

	</tbody>
</table>
<!-- <Table>
	<svelte:fragment slot="header">
		{#each rows as row}
			<Cell>{row.name}</Cell>
		{/each}
		<Cell>Actions</Cell>
	</svelte:fragment>
	{#each values as value, index}
		<TableRow>
			
		</TableRow>
	{/each}
</Table> -->

<Modal bind:open={updateModalOpen}>
	{#if values[activeIndex]}
		<RowEditor {rows} value={values[activeIndex]} on:submit={submit} on:cancel={cancel} />
	{/if}
</Modal>
