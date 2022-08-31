import { AuthService } from '$lib/services';
import { redirect } from '@sveltejs/kit';

export async function POST({ platform, request, locals, setHeaders }) {
	const body = await request.json();
	const { email, password, username } = body;

	try {
		const auth = new AuthService(platform.db, locals.token, locals.secret);
		const result = await auth.signup(null, username, password, { email });

		return new Response(JSON.stringify(result), {
			headers: {
				'set-cookie': `token=${result.access_token};Path=/; HttpOnly;`
			}
		});
	} catch (err) {
		return new Response(JSON.stringify({ message: err.message, status: err.status }));
	}
}
