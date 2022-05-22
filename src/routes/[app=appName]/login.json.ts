import { AuthService } from '$lib/services';

export async function post({ platform, locals, request, params }) {
	const appName = params.app;
	const apiKey = request.headers.get('apiKey');
	const body = await request.json();
	const db = platform.db;
	const { username, password } = body;

	const authService = new AuthService(db, locals.token, locals.secret);
	await authService.verifyApiKeyAccess(appName, apiKey);
	const result = await authService.login(appName, username, password);

	return {
		status: 200,
		body: {
			status: 200,
			access_token: result.access_token,
			user: result.user
		}
	};
}
