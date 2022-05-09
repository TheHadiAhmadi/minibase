/** @type {import('./logout').RequestHandler} */
export async function get() {
	return {
		status: 303,

		headers: {
			'set-cookie': ['token=; HttpOnly; Path=/'],
			location: '/'
		}
	};
}
