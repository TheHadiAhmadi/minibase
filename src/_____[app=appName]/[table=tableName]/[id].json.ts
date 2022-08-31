import { DataService } from '$lib/services';

export async function get({ platform, request, params }) {
	const { app, table, id } = params;
	const { db } = platform;
	const apiKey = request.headers.get('apiKey');

	const dataService = new DataService(db, apiKey, app, table);

	const result = await dataService.get(id);

	return {
		status: 200,
		body: {
			rows: result.rows,
			value: result.values[0].value
		}
	};
}

export async function put({ platform, request, locals, params }) {
	const { app, table, id } = params;
	const body = await request.json();
	const { db } = platform;
	const apiKey = request.headers.get('apiKey');

	// console.log("update", {id, body})
	const dataService = new DataService(db, apiKey, app, table);

	await dataService.update(id, body);

	return {
		status: 200,
		body: {
			success: true,
			status: 200,
			message: 'data updated successfully'
		}
	};
}

export async function del({ platform, request, locals, params }) {
	const { app, table, id } = params;
	const { body } = locals;
	const { db } = platform;
	const apiKey = request.headers.get('apiKey');

	const dataService = new DataService(db, apiKey, app, table);

	await dataService.remove(id);

	return {
		status: 200,
		body: {
			success: true,
			status: 200,
			message: 'data removed successfully'
		}
	};
}
