<script>
	import { page } from '$app/stores';
	import { Form, Page } from '$lib/components';
	import FileUploader from '$lib/components/FileUploader.svelte';
	import { baseUrl } from '$lib/helpers';
	import { Button, FormInput, Input, Modal } from '@svind/svelte';
	import { setContext } from 'svelte';

	let message, id;

	let app = $page.params.app;
	let apiKey = $page.stuff.apiKeys[0]?.apiKey ?? '';

	async function uploadFile({ detail }) {
		const id = detail;
		console.log(id);
	}

	setContext('app', app);
	setContext('apiKey', apiKey);
</script>

<Modal open>
	<FileUploader {app} {apiKey} on:upload={uploadFile} />
</Modal>
