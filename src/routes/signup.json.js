export async function post({ request, locals }) {
	const auth = locals.auth;
	const body = await request.json();
	const { email, password, username } = body;

	const result = await auth.signup({ email, password, username });

	return {
		status: 201,
		body: result,
		headers: {
			'set-cookie': [`token=${result.access_token};Path=/; HttpOnly;`]
		}
	};
}
