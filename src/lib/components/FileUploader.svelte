<script>
	import { page } from '$app/stores';

	import { baseUrl } from '$lib/helpers';

	import {
		Button,
		ButtonList,
		CardBody,
		CardFooter,
		FormGroup,
		FormInput,
		Label
	} from '@svind/svelte';
	import { createEventDispatcher, getAllContexts, getContext } from 'svelte';

	import Form from './Form.svelte';

	import Page from './Page.svelte';

	let el;

	let name;
	let file;

	export let app;
	export let apiKey;

	const dispatch = createEventDispatcher();

	async function submit({ target }) {
		const request = new FormData();

		request.append('file', file);
		request.append('name', name);

		const response = await fetch(`/${app}/files.json`, {
			method: 'POST',
			headers: { apiKey },
			body: request
		}).then((res) => res.json());

		dispatch('upload', response.id);
	}

	function openFileChooser() {
		el.click();
	}

	function onChange(e) {
		file = e.target.files[0];
		name = file.name;
	}

	function close() {
		dispatch('close');
	}
</script>

<Page title="File Uploader">
	<Form>
		<CardBody>
			<input
				bind:this={el}
				on:change={onChange}
				class="hidden"
				label="select file"
				name="file"
				type="file"
			/>
			<FormGroup>
				<Button on:click={openFileChooser}>Choose File</Button>
				{#if file}
					<Label>{file.name}</Label>
				{/if}
			</FormGroup>

			<FormInput disabled={!name} bind:value={name} label="name" name="name" type="text" />
		</CardBody>
		<CardFooter position="end">
			<ButtonList>
				<Button on:click={close}>Close</Button>
				<Button variant="primary" on:click={submit}>Upload</Button>
			</ButtonList>
		</CardFooter>
	</Form>
</Page>
