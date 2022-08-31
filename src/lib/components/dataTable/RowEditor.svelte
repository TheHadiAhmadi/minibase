<script>
	import { Button, ButtonList, Col, FormGroup, FormInput, Label, Modal, Row } from '@svind/svelte';
	import { createEventDispatcher, getAllContexts, getContext } from 'svelte';
	import { Page } from '$lib/components';
	import FileUploader from '../FileUploader.svelte';
	import { baseUrl } from '$lib/helpers';

	export let value;
	export let columns;
	export let appName;
	export let apiKey;

	let uploadOpen = false;

	let fileField = '';

	const dispatch = createEventDispatcher();

	function openUploadModal(name) {
		fileField = name;
		uploadOpen = true;
	}

	function upload({ detail: id }) {
		value[fileField] = `${baseUrl}/files/${id}`;
		uploadOpen = false;
	}

	function submit() {
		dispatch('submit', value);
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

<Page>
	<svelte:fragment slot="body">
		{#each columns as { name, type }}
			{#if name !== 'id'}
				{#if type === 'file'}
					<div class="form-group flex flex-col">
						<Label>{name}</Label>
						<Row class="w-full gap-1 items-center">
							<Col col="expand">
								<FormInput
									placeholder="Enter file url or upload a new file...."
									size="sm"
									bind:value={value[name]}
								/>
							</Col>
							<Col>
								<Button on:click={() => openUploadModal(name)}>Upload</Button>
							</Col>
						</Row>
					</div>
				{:else}
					<FormInput label={name} {type} bind:value={value[name]} />
				{/if}
			{/if}
		{/each}
	</svelte:fragment>
	<ButtonList slot="footer:actions">
		<Button on:click={cancel} size="sm">Cancel</Button>
		<Button on:click={submit} size="sm" variant="primary">Submit</Button>
	</ButtonList>
</Page>

<Modal bind:open={uploadOpen}>
	<FileUploader app={appName} {apiKey} on:close={() => (uploadOpen = false)} on:upload={upload} />
</Modal>

<style global>
	[readonly] {
		opacity: 0.7;
	}
</style>
