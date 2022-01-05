import { find, insert } from '$lib/dbApi';

export async function get(request) {
	const { app, table } = request.params;

	const result = await find('data', { app_id: app, table_id: table });

	const data = result.map((res) => {
		return { id: res.id, ...res.value };
	});

	return {
		body: data,
		status: 200
	};
}

export async function post({ params, body }) {
	const { app, table } = params;

	// require apiKey
	console.log('We need apiKey to make request');

	const result = await insert('data', { value: body, app_id: app, table_id: table });

	return {
		body: result
	};
}
