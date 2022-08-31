<!-- <script context="module">
	export async function load({ fetch, stuff, params }) {
		const apiKey = stuff.apiKeys?.[0]?.apiKey ?? '';

		const response = await fetch(`/${params.app}/${params.table}.json`, {
			headers: {
				apiKey
			}
		}).then((res) => res.json());

		const props = {
			columns: response.rows,
			values: response.values,
			apiKey
		};

		return {
			props
		};
	}
</script> -->

<script>
	import { page } from '$app/stores';
	
	import { Button, Card, CardBody, Col, FormInput, Icon, Modal, Row } from '@svind/svelte';
	import { Page, DataTable } from '$lib/components';
	import { invalidate } from '$app/navigation';

    export let data;

	export let columns = [];
	export let values = [];
	export let apiKey = '';

	$: table = $page.params.table;

	async function insert({ detail }) {
		// console.log('insert', detail);
		// const res = await post(`/${table}.json`, detail, { apiKey });
        const result = await apiInsertData(appName, table, detail)
        
        console.log(result)
		// reload();
	}

	function reload() {
		invalidate(`/${table}.json`);
	}

	function update({ detail }) {
		let id = detail.id;
		// console.log('update', detail);

		// put(`/${table}/${id}.json`, detail, { apiKey });

		// showError(res.message);
	}
	function remove({ detail }) {
		const id = detail.id;
		// console.log('remove', detail);
		// del(`/${table}/${id}.json`, { apiKey });
	}
</script>

<Page full title=" {data.appName} / {table}">
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
