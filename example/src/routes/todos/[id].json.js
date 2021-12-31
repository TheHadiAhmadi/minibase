// get
// delete
// update

import { Todos } from '$lib/api';

export async function get({ params }) {
	const { id } = params;
	return {
		body: await Todos.get(id)
	};
}

export async function del({ params }) {
	return {
		body: await Todos.del(params.id)
	};
}
