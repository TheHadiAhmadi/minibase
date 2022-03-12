<script lang="ts">
	import { Button, Card, CardActions, CardBody, FormInput, Link } from '@ubeac/svelte-components';
	import { createEventDispatcher } from 'svelte';
	import Form from './Form.svelte';
	import Page from './Page.svelte';

	let username;
	let password;

	const dispatch = createEventDispatcher();

	async function submit() {
		const response = await fetch('/api-login', {
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

<Page noPadding title="Login">
	<Form slot="body" on:submit={submit}>
		<FormInput label="Username" type="text" bind:value={username} />
		<FormInput label="Password" type="password" bind:value={password} />
		<CardActions class="justify-between">
			<Link href="/signup" hover>don't have account?</Link>
			<Button size="sm" type="submit">log in</Button>
		</CardActions>
	</Form>
</Page>
