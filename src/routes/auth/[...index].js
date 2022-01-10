const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL not found');

const authUrl = supabaseUrl + '/auth/v1';

/**
 *
 * @param {import("@sveltejs/kit").Request} request
 * @returns
 */
export async function get(request) {
	console.log(request.url);
	const response = await fetch(authUrl + request.url.pathname.slice(5), request);

	console.log(response);

	return {
		status: response.status,
		body: response.json(),
		headers: response.headers
	};
}

export async function post(request) {
	const response = await fetch(request);

	console.log(response);

	return {
		status: response.status,
		body: response.json(),
		headers: response.headers
	};
}

export async function put(request) {
	const response = await fetch(request);

	console.log(response);
	return {
		status: response.status,
		body: response.json(),
		headers: response.headers
	};
}
