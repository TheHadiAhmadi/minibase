import { baseUrl, nanoid } from '$lib/helpers';
import { errorBadRequest, FileService } from '$lib/services';
import { uuid } from '$lib/services/auth';

export async function get() {
	return {
		status: 200,
		body: {
			files: []
		}
	};
}

export async function post({ platform, request, params }) {
	const db = platform.db;
	const apiKey = request.headers.get('apiKey');
	const body = await request.formData();
	const appName = params.app;

	const file = body.get('file');
	const name = body.get('name');

	const fileService = new FileService(db, apiKey);
	const id = nanoid(10);

	await fileService.upload({ file, name, appName, id });

	return {
		status: 200,
		body: {
			status: 200,
			id,
			message: 'File uploaded successfully'
		}
	};
}
