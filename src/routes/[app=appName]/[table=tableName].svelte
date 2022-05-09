<script context="module">
	export async function load({ fetch, stuff, params }) {
		const result = await fetch(`/${params.app}/${params.table}.json`, {
			headers: {
				apiKey: stuff.apiKey ?? ''
			}
		}).then((res) => res.json());

		const props = {
			apiKey: stuff?.apiKey ?? '',
			rows: result.rows,
			values: result.values
		};

		return {
			props
		};
	}
</script>

<script>
	import { page } from '$app/stores';
	import { baseUrl } from '$lib/helpers';
	import { showError } from '$lib/alerts';

	import { Button, Card, CardBody, Col, FormInput, Icon, Modal, Row } from '@svind/svelte';
	import { Page, DataTable } from '$lib/components';
import { invalidate } from '$app/navigation';

	export let rows = [];
	export let values = [];

	function Api(apiKey) {
		return {
			get: async (url) => {
				return await fetch(baseUrl + url + '.json', {
					headers: {
						'Content-Type': 'application/json',
						apiKey
					}
				}).then((res) => res.json());
			},
			post: async (url, data) => {
				return await fetch(baseUrl + url + '.json', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						apiKey
					},
					body: JSON.stringify(data)
				}).then((res) => res.json());
			},
			put: async (url, data) => {
				return await fetch(baseUrl + url + '.json', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						apiKey
					},
					body: JSON.stringify(data)
				}).then((res) => res.json());
			},
			del: async (url, data) => {
				return await fetch(baseUrl + url + '.json', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						apiKey
					}
				}).then((res) => res.json());
			}
		};
	}

	let apiKeyModalOpen = false;
	
	let bindApiKey = $page.stuff.apiKey ?? '';

	$: app = $page.params.app;
	$: table = $page.params.table;
	$: apiKey = $page.stuff.apiKey ?? '';
	$: api = Api(apiKey);

	async function create({ detail }) {
		console.log('create', detail);
		const res = await api.post(`/${app}/${table}.json`, detail);
		invalidate(`/{app}/${table}.json`)
		// load(apiKey);
	}

	async function update({ detail }) {
		console.log('update', detail);
	}
	async function remove({ detail }) {
		console.log('remove', detail);
	}

	function updateApiKey() {
		apiKey = bindApiKey;
		apiKeyModalOpen = false;
	}
</script>


<Page full title=" {app} / {table}">
	<svelte:fragment slot="actions">
		<Button on:click={() => (apiKeyModalOpen = true)} size="sm">
			<Icon icon="fa-solid:key" />
			Api Key
		</Button>
	</svelte:fragment>
	<svelte:fragment slot="body">
		<DataTable on:create={create} on:update={update} on:remove={remove} {rows} {values} />
	</svelte:fragment>
</Page>

<Modal bind:open={apiKeyModalOpen}>
	<Card class=" flex items-end gap-2">
		<CardBody>
			<Row>
				<FormInput
					col="10"
					placeholder="paste a valid ApiKey here..."
					label="Api Key"
					bind:value={bindApiKey}
				/>
				<div class="col-2">
					<Button block on:click={updateApiKey}>Ok</Button>
				</div>
			</Row>
		</CardBody>
	</Card>
</Modal>
