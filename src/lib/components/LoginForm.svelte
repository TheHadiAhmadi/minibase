<script lang="ts">
	import { Button, ButtonList, Card, CardFooter, CardBody, FormInput } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	import Form from './Form.svelte';
	import Page from './Page.svelte';

	export let full = false;

	let username;
	let password;

	const dispatch = createEventDispatcher();

	async function submit() {
		const response = await fetch('/login.json', {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		const res = await response.json();

		if (response.status >= 400) {
			dispatch('error', res);
		} else {
			dispatch('login', res);
		}
	}
</script>

<Page {full} title="Login">
	<Form on:submit={submit}>
		<CardBody>
			<FormInput label="Username" type="text" bind:value={username} />
			<FormInput label="Password" type="password" bind:value={password} />
		</CardBody>

		<CardFooter position="end">
			<ButtonList>
				<Button href="/signup" size="sm">don't have account?</Button>
				<Button variant="primary" size="sm" type="submit">log in</Button>
			</ButtonList>
		</CardFooter>
	</Form>
</Page>
