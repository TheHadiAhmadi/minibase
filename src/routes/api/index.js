import { find } from '$lib/dbApi';

export async function get(request) {
	const result = await find('apps');
	return {
		body: result
	};
}
