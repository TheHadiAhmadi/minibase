import { AppService } from '$lib/services';

export async function get({ platform, locals }) {
	const db = platform.db;
	const auth = await locals.auth;

	const appService = new AppService(db, auth);

	const apps = await appService.getApps();

	return {
		status: 200,
		body: {
			apps
		}
	};
}

export async function post({ platform, locals }) {
	const auth = locals.auth;
	const body = locals.body;
	const db = platform.db;

	const { name, description = '', public: isPublic = false } = body;

	console.log('getApps');
	const appService = new AppService(db, auth);

	const data = await appService.addApp({
		name,
		description,
		isPublic
	});

	return {
		status: 201,
		body: {
			message: 'App created successfully',
			data
		}
	};
}
