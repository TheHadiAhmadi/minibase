<script>
	import { Button, ButtonList, FormInput } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	import { Page } from '$lib/components';

	export let value;
	export let columns;

	const dispatch = createEventDispatcher();

	function submit() {
		dispatch('submit', value);
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

<!-- {JSON.stringify({value, columns})} -->
<Page>
	<svelte:fragment slot="body">
		{#each columns as { name, type, readonly, hidden }}
		<!-- TODO: FormInput should support hidden and readonly -->
		<!-- TODO: Checkbox:checked should be visible in light mode -->
		<!-- TODO: Dropdown should close automatically sometimes -->
		<!-- TODO: MenuItems in header sould be left aligned -->
		<!-- TODO: Move Alert and Table components in svind -->
		{#if !hidden}
			<FormInput label={name} {type} bind:value={value[name]} />
		{/if}
		{/each}
	</svelte:fragment>
	<ButtonList slot="footer:actions">
		<Button on:click={cancel} size="sm">Cancel</Button>
		<Button on:click={submit} size="sm" variant="primary">Submit</Button>
	</ButtonList>
</Page>

<style global>
	[readonly] {
		opacity: 0.7;
	}
</style>