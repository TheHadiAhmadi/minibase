<script lang="ts">
	import { goto } from '$app/navigation';

	import { Button, ButtonList, CardFooter, FormInput } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	import AlertBox from './AlertBox.svelte';
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

<Page noPadding title="Sign Up">
	<Form slot="body" on:submit={submit}>
		<FormInput label="Username" type="text" bind:value={username} />
		<FormInput label="Email" type="email" bind:value={email} />
		<FormInput label="Password" type="password" bind:value={password} />
	</Form>
		<ButtonList slot="footer:actions">
			<Button href="/login">alerady have account?</Button>
			<Button size="sm" variant="primary" type="submit">Sign Up</Button>
		</ButtonList>
</Page>
