/** @type {import('./login.json').RequestHandler} */
export async function post({ request, locals }) {
	const auth = locals.auth;
	const body = await request.json();
	const { username, password } = body;

	const result = await auth.login({ username, password });

	return {
		status: 200,
		body: result,
		headers: {
			'set-cookie': [`token=${result.access_token};Path=/; HttpOnly;`]
		}
	};
}
