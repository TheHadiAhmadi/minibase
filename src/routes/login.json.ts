import { AuthService } from '$lib/services';

/** @type {import('./login.json').RequestHandler} */
export async function post({ platform, request, locals }) {
	const body = await request.json();
	const { username, password } = body;

	const auth = new AuthService(platform.db, locals.token, locals.secret);

	const result = await auth.login(null, username, password);

	return {
		status: 200,
		body: result,
		headers: {
			'set-cookie': [`token=${result.access_token};Path=/; HttpOnly;`]
		}
	};
}
