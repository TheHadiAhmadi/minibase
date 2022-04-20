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
			data: {
				tables: tables,
				apiKeys: apiKeys,
				access: apiKeys?.length > 0
			}
		}
	};
}
export async function post({ params, platform, locals }) {
	const db = platform.db;
	const auth = locals.auth;
	const body = locals.body;
	const appName = params.app;
	const { name, public: isPublic = false, rows } = body;

	const tableService = new TableService(db, auth, appName);

	console.log(name, isPublic, rows);
	const result = await tableService.addTable({ name, isPublic, rows });

	return {
		status: 201,
		body: result
	};
}
