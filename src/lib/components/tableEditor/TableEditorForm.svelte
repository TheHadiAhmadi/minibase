<script>
	import { Button, CardBody, Checkbox, FormInput, ButtonList } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';

	import { Form, Page } from '..';
import Input from '../Input.svelte';
	import RowsEditor from './RowsEditor.svelte';

	export let title = 'Add Table';

	export let rows = [
		{name: 'id', type: 'string'}
	];
	export let name = '';
	let isPublic = false;
	export { isPublic as public };

	const dispatch = createEventDispatcher();

	function submit() {
		dispatch('submit', { rows, name, public: isPublic });
		name = ''
		isPublic = false
		rows = []
	}

	function cancel() {
		dispatch('cancel');
		name = ''
		isPublic = false
		rows = [
			{name: 'id', type: 'string'}

		]
	}
</script>

<Page {title}>
	<CardBody>
		<Input placeholder="Table Name" bind:value={name} />
		<div class="mt-4" />
		<Checkbox variant="primary" bind:value={isPublic}>Public</Checkbox>
		{#if rows}
			<RowsEditor bind:rows />
		{/if}
	</CardBody>
	<ButtonList slot="footer:actions">
		<Button on:click={cancel}>Cancel</Button>
		<Button variant="primary" on:click={submit}>Submit</Button>
	</ButtonList>
</Page>
