import { AuthService } from '$lib/services';

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform, request, locals }) {
	const body = await request.json();
	const { username, password } = body;

	const auth = new AuthService(platform.db, locals.token, locals.secret);

	try {
		const result = await auth.login(null, username, password);

		return new Response(JSON.stringify(result), {
			headers: {
				'set-cookie': `token=${result.access_token};Path=/; HttpOnly; Domain=localhost:8000`
			}
		});
	} catch (err) {
		return new Response(JSON.stringify({ status: err.status, message: err.message }));
	}
}
