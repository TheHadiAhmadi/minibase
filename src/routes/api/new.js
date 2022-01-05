import { insert } from '$lib/dbApi';
import { getUserId } from '$lib/supabase';
import { get } from '.';

export async function post({ body, headers }) {
	const owner_id = await getUserId(headers['authorization']);
	const result = await insert('apps', {
		owner_id,
		name: body.name,
		description: body.description
	});

	if (!owner_id) {
		return {
			status: 401,
			body: {
				message: "You can't create new App"
			}
		};
	}

	return {
		body: result
	};
}
