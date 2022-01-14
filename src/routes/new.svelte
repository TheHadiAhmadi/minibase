<script>
	import { goto } from '$app/navigation';
	import { baseUrl } from '$lib/helpers';
	import { session } from '$app/stores';

	import { Button, Card, CardTitle, FormGroup, Input, Label } from '@ubeac/svelte-components';
	import { post } from '$lib/api';

	let request = {};

	async function onSubmit(e) {
		const result = await post('/', request);
		console.log('submit', result);

		goto('/');
	}

	let nameFeedback = '';

	let valid = true;

	$: {
		valid = true;
		nameFeedback = '';
		if (!request.name) {
			valid = false;
		} else {
			if (request.name.length < 3 || request.name.length > 50) {
				nameFeedback = 'name length should be between 3 and 50 characters';
				valid = false;
			}
			if (!request.name.match(/^[a-zA-Z0-9_-]*$/)) {
				valid = false;
				nameFeedback = 'name should only contains a-z, A-Z, 0-9, _ and -';
			}
		}
	}
</script>

<Card compact>
	<CardTitle slot="title">Create New App</CardTitle>
	<form on:submit|preventDefault={onSubmit}>
		<FormGroup name="name">
			<Label>App Name</Label>
			<Input bind:value={request.name} />
			<div class="text-sm text-gray-700">{nameFeedback}</div>
		</FormGroup>
		<FormGroup name="description">
			<Label>Description</Label>
			<Input type="text" bind:value={request.description} />
		</FormGroup>

		<Button
			type="submit"
			disabled={!valid}
			class="w-full ml-auto mt-8 {valid ? '' : 'btn-disabled'}"
		>
			Create
		</Button>
	</form>
</Card>
