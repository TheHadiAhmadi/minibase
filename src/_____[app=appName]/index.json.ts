import { AppService } from '$lib/services';
import { TableService } from '$lib/services';

export async function get({ platform, params, locals }) {
	const name = params.app;
	const db = platform.db;
	const user = locals.user;

	const appService = new AppService(db, user);

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
