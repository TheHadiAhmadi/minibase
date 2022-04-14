<script>
	import { page } from '$app/stores';
	import { baseUrl } from '$lib';
	import { showAlert } from '$lib/errors';

	import { Button, FormInput, Icon, Modal } from '@ubeac/svelte-components';
	import { Page, DataTable } from '$lib/components';

	let api = Api('');

	function Api(apiKey) {
		return {
			get: async (url) => {
				return await fetch(baseUrl + url, {
					headers: {
						'Content-Type': 'application/json',
						apiKey
					}
				}).then((res) => res.json());
			},
			post: async (url, data) => {
				return await fetch(baseUrl + url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						apiKey
					},
					body: JSON.stringify(data)
				}).then((res) => res.json());
			},
			put: async (url, data) => {
				return await fetch(baseUrl + url, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						apiKey
					},
					body: JSON.stringify(data)
				}).then((res) => res.json());
			},
			del: async (url, data) => {
				return await fetch(baseUrl + url, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						apiKey
					}
				}).then((res) => res.json());
			}
		};
	}

	$: app = $page.params.app;
	$: table = $page.params.table;

	let apiKeyModalOpen = true;
	let apiKey = '';
	let bindApiKey = '';
	let values = [];

	$: api = Api(apiKey);

	let rows = [
		{ name: 'test', type: 'string' },
		{ name: 'another', type: 'number' }
	];

	$: if (api && apiKey) load(apiKey);

	async function load(apiKey) {
		const res = await Api(apiKey).get(`/apps/${app}/${table}.json`);

		console.log('inside load', res);
		if (res.status === 200) {
			values = res.data.values;
			rows = res.data.rows;
		} else {
			showAlert(res.message);
		}
	}

	$: console.log({ rows, values });

	async function create({ detail }) {
		console.log('create', detail)
		const res = await api.post(`/apps/${app}/${table}.json`, detail);
	}

	async function update({ detail }) {
		console.log('update', detail);
	}
	async function remove({ detail }) {
		console.log('remove', detail);
	}
</script>

<Page title=" {app} / {table}">
	<svelte:fragment slot="actions">
		<Button
			variant="ghost"
			class="border border-base-300"
			on:click={() => (apiKeyModalOpen = true)}
			size="sm"
		>
			<Icon class="mr-2" icon="fa-solid:key" />
			Api Key
		</Button>
	</svelte:fragment>
	<svelte:fragment slot="body">
		<DataTable on:create={create} on:update={update} on:remove={remove} {rows} {values} />
	</svelte:fragment>
</Page>

<Modal bind:open={apiKeyModalOpen}>
	<div class="flex items-end gap-2">
		<FormInput placeholder="paste a valid ApiKey here..." label="Api Key" bind:value={bindApiKey} />
		<Button
			on:click={() => {
				apiKeyModalOpen = false;
				apiKey = bindApiKey;
			}}>Ok</Button
		>
	</div>
</Modal>
