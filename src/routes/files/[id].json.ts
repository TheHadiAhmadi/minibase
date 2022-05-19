import { FileService } from '$lib/services';

export async function get({ params, platform }) {
	const id = params.id;
	const db = platform.db;

	const fileService = new FileService(db);

	return {
		status: 200,
		body: {
			file: await fileService.getInfo(id)
		}
	};
}
