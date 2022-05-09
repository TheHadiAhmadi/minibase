<script lang="ts">
	import { goto } from '$app/navigation';
import { session } from '$app/stores';

	import { Button, ButtonList, CardFooter, FormInput } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	import AlertBox from './AlertBox.svelte';
	import Form from './Form.svelte';
	import Page from './Page.svelte';

	export let full = false;

	let username;
	let email;
	let password;

	const dispatch = createEventDispatcher();

	async function submit() {
		const response = await fetch('/signup.json', {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json'
			},
			body: JSON.stringify({ username, email, password })
		});

		const res = await response.json();
		console.log({res})

		
		

		if (response.status >= 400) {
			dispatch('error', res);
		} else {
			$session = {
			user: {
				username: res.user.username,
				email: res.user.email,
			}
		}
			dispatch('signup', res);
		}
	}
</script>

<Page {full} title="Sign Up">
	<Form slot="body" on:submit={submit}>
		<FormInput label="Username" type="text" bind:value={username} />
		<FormInput label="Email" type="email" bind:value={email} />
		<FormInput label="Password" type="password" bind:value={password} />
	</Form>
	<ButtonList slot="footer:actions">
		<Button href="/login" size="sm">alerady have account?</Button>
		<Button on:click={submit} size="sm" variant="primary" type="submit">Sign Up</Button>
	</ButtonList>
</Page>
