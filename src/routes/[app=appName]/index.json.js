import { AppService } from '$lib/services';
import { TableService } from '$lib/services';

export async function get({ platform, params, locals }) {
	const name = params.app;
	const db = platform.db;
	const auth = locals.auth;

	const appService = new AppService(db, auth);

	const { tables, apiKeys } = await appService.getTables(name);

	return {
		status: 200,
		body: {
			status: 200,
			tables: tables,
			apiKeys: apiKeys,
			access: apiKeys?.length > 0
		}
	};
}
export async function post({ params, request, platform, locals }) {
	const db = platform.db;
	const auth = locals.auth;
	const body = await request.json();
	const appName = params.app;
	const { name, public: isPublic = false, rows } = body;

	const tableService = new TableService(db, auth, appName);

	const result = await tableService.addTable({ name, isPublic, rows });

	return {
		status: 201,
		body: result
	};
}
