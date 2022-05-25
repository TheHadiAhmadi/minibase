import { uuid } from '$lib/services/auth';
import { DataService, TableService } from '$lib/services';

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
			values,
			rows
		}
	};
}

export async function post({ platform, request, params }) {
	const body = await request.json();
	const db = platform.db;
	const apiKey = request.headers.get('apiKey');
	const { app, table } = params;

	const dataService = new DataService(db, apiKey, app, table);
	const id = body.id ?? uuid();

	const result = await dataService.insert(id, body);

	return {
		status: 200,
		body: {
			data: { ...body, id }
		}
	};
}

export async function del({ platform, locals, params }) {
	const appName = params.app;
	const tableName = params.table;
	const user = locals.user;
	const db = platform.db;

	const tableService = new TableService(db, user, appName);
	await tableService.removeTable(tableName);

	return {
		status: 200,
		body: {
			data: { message: true }
		}
	};
}

export async function put({ platform, locals, params }) {
	console.log('rename table or update rows');
	console.log('put', { platform, locals, params });

	console.log('TODO');

	return {
		status: 200,
		body: {
			success: true,
			message: 'Table updated successfully',
			status: 200
		}
	};
}
