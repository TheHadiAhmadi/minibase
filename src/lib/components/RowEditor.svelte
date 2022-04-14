<script>
	import { Button, CardFooter, FormInput } from '@svind/svelte';
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

	</svelte:fragment>
		<CardFooter slot="footer:actions">
			<Button on:click={cancel} size="sm" variant="ghost">Cancel</Button>
			<Button on:click={submit} size="sm">Submit</Button>
		</CardFooter>
</Page>
