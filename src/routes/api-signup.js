export async function post({ locals }) {
	const auth = locals.auth;
	const body = locals.body;
	const { email, password, username } = body;

	const result = await auth.signup({ email, password, username });

	return {
		status: 201,
		body: result
	};
}
