import { find } from '$lib/dbApi';
import supabase, { getUserId } from '$lib/supabase';

/**
 *
 * @param {import('@sveltejs/kit').Request} request
 * @returns
 */
export async function get(request) {
	const owner_id = await getUserId(request.headers.authorization);

	if (!owner_id) {
		return {
			status: 401,
			body: {
				message: "You don't have access here"
			}
		};
	}

	const result = await find('apps', { owner_id });
	return {
		body: result
	};
}
