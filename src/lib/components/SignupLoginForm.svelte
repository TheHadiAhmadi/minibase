<script lang="ts">
	import { session } from '$app/stores';

	import {
		Button,
		ButtonList,
		Card,
		CardFooter,
		CardBody,
		FormInput,
		Input,
		Row,
		Col
	} from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	import Form from './Form.svelte';
	import Page from './Page.svelte';

	export let full = false;

	export let mode: 'login' | 'signup' = 'login';

	let model: { username: string; password: string; email?: string } = {
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
			<Input placeholder="Username" type="text" bind:value={model.username} />
			{#if mode === 'signup'}
				<Input placeholder="Email" type="email" bind:value={model.email} />
			{/if}
			<Input placeholder="Password" type="password" bind:value={model.password} />

		</CardBody>
		
		<CardFooter position="end">
			<Row class="text-center text-xs py-6">
				<Col class="" col="6">
					{#if mode === 'login'}
						<a href="/signup">Register</a>
					{:else}
						<a href="/login">Login</a>
					{/if}
				</Col>
	
				<Col class="" col="6">
					<a>Forgot Password</a>
				</Col>
			</Row>
			<ButtonList>
				{#if mode === 'login'}
					<!-- <Button on:click={() => mode = 'signup'} size="sm">don't have account?</Button> -->
					<Button block variant="primary" type="submit">Log in</Button>
				{:else}
					<!-- <Button on:click={() => mode = 'login'} size="sm">already have an account?</Button> -->
					<Button block variant="primary" type="submit">Sign up</Button>
				{/if}
			</ButtonList>
		</CardFooter>
	</Form>
</Page>
