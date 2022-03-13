<script>
	import { Button, CardActions, FormInput } from '@ubeac/svelte-components';
	import { createEventDispatcher } from 'svelte';
	import { Page } from '.';

	export let value;
	export let rows;

	const dispatch = createEventDispatcher();

	function submit() {
		dispatch('submit', value);
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

<Page noPadding>
	<svelte:fragment slot="body">
		{#each rows as { name, type }}
			<FormInput label={name} bind:value={value[name]} />
		{/each}

		<CardActions position="end">
			<Button on:click={cancel} size="sm" variant="ghost">Cancel</Button>
			<Button on:click={submit} size="sm">Submit</Button>
		</CardActions>
	</svelte:fragment>
</Page>
