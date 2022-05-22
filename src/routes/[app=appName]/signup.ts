import { AuthService } from '$lib/services';

export async function post({ platform, locals, request, params }) {
	const { db } = platform;
	const { app: appName } = params;
	const body = await request.json();
	const apiKey = request.headers.get('ApiKey');
	const { username, password, ...data } = body;

	const authService = new AuthService(db, locals.token, locals.secret);

	await authService.verifyApiKeyAccess(appName, apiKey);
	const result = await authService.signup(appName, username, password, data);

	return {
		status: 201,
		body: {
			status: 201,
			access_token: result.access_token,
			user: result.user
		}
	};
}
