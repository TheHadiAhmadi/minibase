<script>
	import { FormGroup, Input, Label } from '@ubeac/svelte-components';
	export let apiKeys;
</script>

<FormGroup>
	<Label>Api Keys</Label>

	{#each apiKeys as apiKey}
		<FormGroup class="pt-4">
			<Label>{apiKey.name}</Label>
			<Input readonly value={apiKey.apiKey} />
		</FormGroup>
	{/each}
</FormGroup>
