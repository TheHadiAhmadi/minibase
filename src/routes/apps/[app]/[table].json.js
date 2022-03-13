import { DataService } from '$lib/services';

export async function get({ platform, request, params }) {
	const { app, table } = params;
	const db = platform.db;
	const apiKey = request.headers.get('apiKey');

	const dataService = new DataService(db, apiKey, app, table);

	const { values, rows } = await dataService.get();

	return {
		status: 200,
		body: {
			status: 200,
			data: {
				values,
				rows
			}
		}
	};
}

export async function post({ platform, locals, request, params }) {
	const body = locals.body;
	const db = platform.db;
	const apiKey = request.headers.get('apiKey');
	const { app, table } = params;

	const dataService = new DataService(db, apiKey, app, table);

	const result = await dataService.insert(body);

	return {
		status: 200,
		body: {
			data: result
		}
	};
}
