import { AppService } from '$lib/services';

export async function get({ platform, locals }) {
	const db = platform.db;
	const user = await locals.user;

	const appService = new AppService(db, user);

	const apps = await appService.getApps();

	return {
		status: 200,
		body: {
			apps
		}
	};
}

export async function post({ request, platform, locals }) {
	const user = locals.user;
	const body = await request.json();
	const db = platform.db;

	const { name, description = '', public: isPublic = false } = body;

	const appService = new AppService(db, user);

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
