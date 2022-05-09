import { AppService } from '$lib/services';

export async function get({ platform, locals }) {
	const db = platform.db;
	const auth = await locals.auth;

	const appService = new AppService(db, auth);


	const apps = await appService.getApps();
	console.log('backend', { apps });

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

	console.log({auth}, await auth.getUser())

	const { name, description = '', public: isPublic = false } = body;

	const appService = new AppService(db, auth);

	console.log('adding app', { name, description, isPublic });

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
