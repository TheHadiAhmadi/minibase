export async function post({ locals }) {
	const auth = locals.auth;
	const body = locals.body;
	const { username, password } = body;

	const result = await auth.login({ username, password });

	return {
		status: 200,
		body: result
	};
}
