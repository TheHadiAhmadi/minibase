<script>
	import { goto } from '$app/navigation';

	import { Button, ButtonList, CardFooter, Checkbox, FormInput, Modal } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	import { apiCreateApp } from '../api';

	import Form from './Form.svelte';
	import Input from './Input.svelte';

	import Page from './Page.svelte';

	export let loading = false;

	export let full = false;
	let request = {};

	const dispatch = createEventDispatcher();

	async function onSubmit(e) {
		loading = true;
		const result = await apiCreateApp(request);

		if (result.status >= 400) {
			dispatch('error', result);
		} else {
			dispatch('success', result);
			goto('/');
		}
	}

	let nameFeedback = '';

	let valid = true;

	// TODO: use validation library
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

<Page {full} title="Create New App">
	<Form slot="body" on:submit={onSubmit}>
		<Input placeholder="App Name" bind:value={request.name} />
		<div class="text-sm text-gray-500">{nameFeedback}</div>
		<Input placeholder="Description" bind:value={request.description} />
		<div class="h-2" />
		<Checkbox bind:value={request.public}>Public</Checkbox>
	</Form>
	<ButtonList slot="footer:actions">
		<Button ghost on:click={() => console.log('TODO: close')}>Cancel</Button>
		<Button on:click={onSubmit} variant="primary" disabled={!valid || loading}>Create</Button>
	</ButtonList>
</Page>
