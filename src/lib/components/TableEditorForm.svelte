<script>
	import { Button, CardActions, CardBody, Checkbox, FormInput } from '@ubeac/svelte-components';
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

<Page noPadding {title}>
	<CardBody>
		<FormInput label="Table Name" bind:value={name} />
		<div class="mt-4" />
		<Checkbox class="-ml-0.5" bind:checked={isPublic}>Public</Checkbox>
		{#if rows}
			<RowsEditor bind:rows />
		{/if}
		<CardActions>
			<Button variant="ghost" on:click={cancel}>Cancel</Button>
			<Button on:click={submit}>Submit</Button>
		</CardActions>
	</CardBody>
</Page>
