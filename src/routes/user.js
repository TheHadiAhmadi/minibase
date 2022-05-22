export async function get({ locals }) {
	console.log({ locals });
	return {
		body: await locals.user
	};
}

export async function put({ request }) {
	const body = await request.json();
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
