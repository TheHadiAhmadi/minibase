<script>
	import { Button, FormGroup, FormInput, Icon, Input, Label } from '@ubeac/svelte-components';
	import Page from './Page.svelte';
	export let apiKeys;

	function add() {
		adding = true;
	}

	let adding = false;
</script>

<Page noPadding title="Api Keys">
	<Button slot="actions" size="sm" on:click={add}>
		<Icon slot="prefix" class="mr-2" icon="fa-solid:plus" />
		Add
	</Button>
	<svelte:fragment slot="body">
		<div class="h-40" />
		{#if adding}
			<div class="h-40" />
		{/if}

		{#each apiKeys as apiKey}
			<FormInput label={apiKey.name} bind:value={apiKey.apiKey} />
		{/each}
	</svelte:fragment>
</Page>
