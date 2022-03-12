<script lang="ts">
	import { goto } from '$app/navigation';

	import { Button, Card, CardActions, CardBody, FormInput, Link } from '@ubeac/svelte-components';
	import { createEventDispatcher } from 'svelte';
	import Form from './Form.svelte';
	import Page from './Page.svelte';

	let username;
	let email;
	let password;

	const dispatch = createEventDispatcher();

	async function submit() {
		const response = await fetch('/api-signup', {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json'
			},
			body: JSON.stringify({ username, email, password })
		});

		const res = await response.json();

		if (response.status >= 400) {
			dispatch('error', res);
		} else {
			dispatch('signup', res);
		}
	}
</script>

<Page center size="md" title="Sign Up">
	<Form slot="body" on:submit={submit}>
		<FormInput label="Username" type="text" bind:value={username} />
		<FormInput label="Email" type="email" bind:value={email} />
		<FormInput label="Password" type="password" bind:value={password} />
		<CardActions class="justify-between">
			<Link href="/login" hover>alerady have account?</Link>
			<Button size="sm" type="submit">Sign Up</Button>
		</CardActions>
	</Form>
</Page>
