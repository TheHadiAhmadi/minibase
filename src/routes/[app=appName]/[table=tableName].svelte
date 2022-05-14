<script context="module">
	export async function load({ fetch, stuff, params }) {
		const apiKey =  stuff.apiKeys?.[0]?.apiKey ?? ''

		console.log({apiKey,  stuff})
		const response = await fetch(`/${params.app}/${params.table}.json`, {
			headers: {
				apiKey
			}
		}).then((res) => res.json());

		const props = {
			columns: [{name: 'id', type: 'string', hidden: true}, ...response.rows],
			values: response.values,
			apiKey,
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
	import { put, post, del } from '$lib/api';

	export let columns = [];
	export let values = [];
	export let apiKey = '';

	$: app = $page.params.app;
	$: table = $page.params.table;

	async function insert({ detail }) {
		// console.log('insert', detail);
		const res = await post(`/${app}/${table}.json`, detail, { apiKey });

		reload()
	}
	
	function reload() {
		invalidate(`/${app}/${table}.json`);
	}

	function update({ detail }) {
		let id = detail.id;
		// console.log('update', detail);
		
		put(`/${app}/${table}/${id}.json`, detail, {apiKey});

		// showError(res.message);
	}
	function remove({ detail }) {
		const id = detail.id
		// console.log('remove', detail);
		del(`/${app}/${table}/${id}.json`, {apiKey});
	}
</script>

<Page full title=" {app} / {table}">
	<Button on:click={reload} slot="actions">Reload</Button>
	<DataTable
		slot="body"
		rows={values}
		{columns}
		on:insert={insert}
		on:update={update}
		on:remove={remove}
	/>
</Page>
