import { DataService, TableService } from '$lib/services';

export async function get({ platform, request, params }) {
	const { app, table } = params;
	const db = platform.db;
	const apiKey = request.headers.get('apiKey');

	console.log({apiKey})

	if (!apiKey)
		return {
			status: 200,
			body: {
				status: 200,
				values: [],
				rows: []
			}
		};

	const dataService = new DataService(db, apiKey, app, table);

	const { values, rows } = await dataService.get();

	console.log("APP_TABLE_JSON", {values, rows, apiKey})

	return {
		status: 200,
		body: {
			status: 200,
			values,
			rows
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

export async function del({ platform, locals, params }) {
	const appName = params.app;
	const tableName = params.table;
	const auth = locals.auth;
	const db = platform.db;

	console.log('delete');

	const tableService = new TableService(db, auth, appName);
	await tableService.removeTable(tableName);

	return {
		status: 200,
		body: {
			data: { message: true }
		}
	};
}
