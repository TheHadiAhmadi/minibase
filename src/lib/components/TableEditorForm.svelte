<script>
	import { Button, CardBody, Checkbox, FormInput, ButtonList } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';

	import { Page } from '.';
	import RowsEditor from './RowsEditor.svelte';

	export let title = 'Add Table';

	export let rows = [];
	export let name = '';
	let isPublic = false;
	export { isPublic as public };

	const dispatch = createEventDispatcher();

	function submit() {
		console.log(rows, name, isPublic);
		dispatch('submit', { rows, name, public: isPublic });
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

<Page {title}>
	<CardBody>
		<FormInput label="Table Name" bind:value={name} />
		<div class="mt-4" />
		<Checkbox bind:value={isPublic}>Public</Checkbox>
		{#if rows}
			<RowsEditor bind:rows />
		{/if}
	</CardBody>
	<ButtonList slot="footer:actions">
		<Button on:click={cancel}>Cancel</Button>
		<Button variant="primary" on:click={submit}>Submit</Button>
	</ButtonList>
</Page>
