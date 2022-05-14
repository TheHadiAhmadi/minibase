<script lang="ts">
	import { session } from '$app/stores';

	import { Button, ButtonList, Card, CardFooter, CardBody, FormInput } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	import Form from './Form.svelte';
	import Page from './Page.svelte';

	export let full = false;

	export let mode: 'login' | 'signup' = 'login'

	let model: {username: string, password: string, email?: string} = {
		username: '',
		password: ''
	};

	const dispatch = createEventDispatcher();

	async function submit() {

		const response = await fetch(`/${mode}.json`, {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json'
			},
			body: JSON.stringify(model)
		});

		const res = await response.json();

		if (response.status >= 400) {
			dispatch('error', res);
		} else {
			$session = {
				user: {
					username: res.user.username,
					email: res.user.email
				}
			};

			dispatch(mode, res);
		}
	}
</script>

<Page {full} title={mode === 'login' ? 'Login' : 'Signup'}>
	<Form on:submit={submit}>
		<CardBody>
			<FormInput label="Username" type="text" bind:value={model.username} />
			{#if mode === 'signup'}
				<FormInput label="Email" type="email" bind:value={model.email} />
			{/if}
			<FormInput label="Password" type="password" bind:value={model.password} />
		</CardBody>

		<CardFooter position="end">
			<ButtonList>
				{#if mode === 'login'}
					<Button on:click={() => mode = 'signup'} size="sm">don't have account?</Button>
					<Button variant="primary" size="sm" type="submit">Log in</Button>
				{:else}
					<Button on:click={() => mode = 'login'} size="sm">already have an account?</Button>
					<Button variant="primary" size="sm" type="submit">Sign up</Button>
				{/if}
			</ButtonList>
		</CardFooter>
	</Form>
</Page>
