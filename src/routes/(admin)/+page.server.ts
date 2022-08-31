import { AppService, TableService } from '$lib/services';

export async function load({ parent, platform, locals }) {
	console.log("RUN LOAD //")
	const db = platform.db;
	const user = locals.user;
	const data = await parent();

	let tables = [];
	let apiKeys = [];
	const appService = new AppService(db, user);

	if (data.appName) {
		// we are in [app].host.com/ page
		const result = await appService.getTables(data.appName);
		tables = result.tables;
		apiKeys = result.apiKeys;
	}

	const apps = await appService.getApps();
	const publicApps = await appService.getPublicApps();

	return {
		status: 200,
		apps,
		publicApps,
		tables,
		apiKeys
	};
}

export async function POST({ request, platform, locals }) {
	const user = locals.user;
	const body = await request.json();
	const db = platform.db;

	const { name, description = '', public: isPublic = false } = body;

	const appService = new AppService(db, user);

	
	console.log('created new app', data);
	// return {
	// 	status: 201,
	// 	body: {
	// 		message: 'App created successfully',
	// 		data
	// 	}
	// };
}
