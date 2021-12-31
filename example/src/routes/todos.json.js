import { api, Todos } from '$lib/api';

export async function get(request) {
	const todos = await Todos.get();
	console.log(todos);

	return {
		body: todos
	};
}

export async function post({ body }) {
	const result = await Todos.post(body);

	console.log(result);
	return {
		body: result
	};
}
