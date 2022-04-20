<script>
	import { page } from '$app/stores';
	import { baseUrl } from '$lib';
	import { showError } from '$lib/alerts';

	import { Button, Card, CardBody, Col, FormInput, Icon, Modal, Row } from '@svind/svelte';
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

	let rows = [];

	$: if (api && apiKey) load(apiKey);

	async function load(apiKey) {
		const res = await Api(apiKey).get(`/${app}/${table}.json`);

		console.log('inside load', res);
		if (res.status < 300) {
			values = res.data.values;
			rows = res.data.rows;
		} else {
			showError(res.message);
		}
	}

	$: console.log({ rows, values });

	async function create({ detail }) {
		console.log('create', detail);
		const res = await api.post(`/${app}/${table}.json`, detail);
		load(apiKey);
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
	<Card class="bg-light dark:bg-dark flex items-end gap-2">
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
