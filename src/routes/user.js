export async function get({ locals }) {
	return {
		body: await locals.auth.getUser()
	};
}

export async function put({ locals }) {
	const { auth, body } = locals;
	const { username, email, password } = body;

	const data = await auth.updateUser({ username, email, password });

	return {
		status: 200,
		body: {
			data,
			message: data.updated + ' updated successfully'
		}
	};
}
