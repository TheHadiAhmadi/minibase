import { FileService } from '$lib/services';

export async function get({ platform, params }) {
	const db = platform.db;
	const id = params.id;

	console.log(id);
	const fileService = new FileService(db);

	return {
		status: 200,
		body: await fileService.download(id)
	};
}
