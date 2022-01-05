import { find, insert, update, remove } from '$lib/dbApi';

export async function get({ params }) {
	// filtering

	const result = await find('tables', { app_id: params.app.split('.')[0] });
	return {
		body: result
	};
}

export async function post({ body, params }) {
	const result = await insert('tables', {
		app_id: params.app,
		name: body.name,
		rows: body.rows
	});

	return {
		body: result
	};
}

// update app
export async function put({ body, params }) {
	// const result = await update('tables', params.app, body); //app.json => app
	// return {
	// 	body: result
	// };
}
