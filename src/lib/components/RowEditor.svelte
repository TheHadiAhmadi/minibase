<script>
	import { Button, ButtonList, FormInput } from '@svind/svelte';
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

<Page>
	<svelte:fragment slot="body">
		{#each rows as { name, type }}
			<FormInput label={name} bind:value={value[name]} />
		{/each}
	</svelte:fragment>
	<ButtonList slot="footer:actions">
		<Button on:click={cancel} size="sm">Cancel</Button>
		<Button on:click={submit} size="sm" variant="primary">Submit</Button>
	</ButtonList>
</Page>
