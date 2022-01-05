<script>
	import { goto } from '$app/navigation';
	import session from '$lib/stores/session';

	import { Button, FormGroup, Input, Label } from '@ubeac/svelte-components';

	import Page from './Page.svelte';
	let sidebarOpen = true;

	let request = {};

	async function submit(e) {
		e.preventDefault();
		console.log($session);
		await fetch('/api/new', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + $session.access_token
			},
			body: JSON.stringify(request)
		});
		console.log('Goto: /');
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

<form on:submit={submit}>
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
		class="w-full ml-auto mt-8 {valid ? '' : 'input-disabled'}">Create</Button
	>
</form>
