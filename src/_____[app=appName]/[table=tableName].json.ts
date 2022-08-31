import { uuid } from '$lib/services/auth';
import { DataService, TableService } from '$lib/services';

export async function get({ platform, request, params }) {
	const { app, table } = params;
	const db = platform.db;
	const apiKey = request.headers.get('apiKey');

	const dataService = new DataService(db, apiKey, app, table);

	const { values, rows } = await dataService.get();

	return {
		status: 200,
		body: {
			status: 200,
			values,
			rows
		}
	};
}

export async function post({ platform, request, params }) {
	const body = await request.json();
	const db = platform.db;
	const apiKey = request.headers.get('apiKey');
	const { app, table } = params;

	const dataService = new DataService(db, apiKey, app, table);

	const multiple = !!Array.isArray(body) 
	let result;
	let newBody;
	if(multiple) {
		newBody = body.map(b => ({ id: uuid(), ...b}));
		result = await dataService.insertMany(newBody);
		
	} else {
		body.id = body.id ?? uuid();
		result = await dataService.insert(body.id, body);
	}


	return {
		status: 200,
		body: {
			data: multiple ? newBody : body
		}
	};
}



export async function put({ platform, locals, params }) {
	console.log('rename table or update rows');
	console.log('put', { platform, locals, params });

	console.log('TODO');

	return {
		status: 200,
		body: {
			success: true,
			message: 'Table updated successfully',
			status: 200
		}
	};
}
