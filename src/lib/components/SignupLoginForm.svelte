<script lang="ts">
	// import { session } from '$app/stores';

	// const session = {}
	import {
		Button,
		ButtonList,
		Card,
		CardFooter,
		CardBody,
		FormInput,
		Row,
		Col
	} from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	import Form from './Form.svelte';
	import Page from './Page.svelte';
	import Input from './Input.svelte';

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

		const res = await response.json()
		if (res.status >= 400) {

			dispatch('error',res);
		} else {
			// $session = {
			// 	user: {
			// 		username: res.user.username,
			// 		email: res.user.data?.email ?? res.user.email 
			// 	}
			// };
			console.log("update session")

			dispatch(mode, res);
		}
	}
</script>

<Page {full} title={mode === 'login' ? 'Login' : 'Signup'}>
	<Form on:submit={submit}>
		<CardBody>
			<Row class="w-full text-xs">
				<Col col="12">
					<Input
						startIcon="la:user"
						placeholder="Username"
						type="text"
						bind:value={model.username}
					/>
				</Col>
				{#if mode === 'signup'}
					<Col col="12">
						<Input
							startIcon="la:envelope"
							placeholder="Email"
							type="email"
							bind:value={model.email}
						/>
					</Col>
				{/if}
				<Col col="12">
					<Input
						startIcon="la:key"
						placeholder="Password"
						type="password"
						bind:value={model.password}
					/>
				</Col>

				<Col col="12" class="mt-4">
					{#if mode === 'login'}
						<Button block variant="primary" type="submit">Log in</Button>
					{:else}
						<Button block variant="primary" type="submit">Sign up</Button>
					{/if}
				</Col>

				<Col class="mt-6 h-auto text-center flex flex-col gap-2" col="12">
					{#if mode === 'login'}
						<a href="/signup">Don't have account?</a>
						<a href="/signup#TODO">Forgot Password?</a>
					{:else}
						<a href="/login">already have an account?</a>
					{/if}
				</Col>
			</Row>
		</CardBody>
	</Form>
</Page>
