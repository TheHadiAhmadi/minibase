<script>
	import { post } from '$lib/api';

	import { Button, CardFooter, Checkbox, FormInput, Modal } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';

	import Form from './Form.svelte';

	import Page from './Page.svelte';

	export let loading = false;

	let request = {};

	const dispatch = createEventDispatcher();

	async function onSubmit(e) {
		console.log(request);
		loading = true;
		const result = await post('/apps.json', request);

		if (result.status >= 400) {
			dispatch('error', result);
		} else {
			dispatch('success', result);
		}
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

<Page title="Create New App">
	<Form slot="body" on:submit={onSubmit}>
		<FormInput label="App Name" bind:value={request.name} />
		<div class="text-sm text-gray-500">{nameFeedback}</div>
		<FormInput label="Description" bind:value={request.description} />
		<div class="h-2" />
		<Checkbox bind:value={request.public}>Public</Checkbox>
	</Form>
	<Button on:click={onSubmit} slot="footer:actions" variant="primary" disabled={!valid || loading}
		>Create</Button
	>
</Page>
