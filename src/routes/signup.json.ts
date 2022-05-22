import { AuthService } from '$lib/services';

export async function post({ platform, request, locals }) {
	const body = await request.json();
	const { email, password, username } = body;

	const auth = new AuthService(platform.db, locals.token, locals.secret);
	const result = await auth.signup(null, username, password, { email });

	return {
		status: 201,
		body: result,
		headers: {
			'set-cookie': [`token=${result.access_token};Path=/; HttpOnly;`]
		}
	};
}
