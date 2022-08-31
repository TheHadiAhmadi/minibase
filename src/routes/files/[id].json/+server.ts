import { FileService } from '$lib/services';

export async function get({ params, platform }) {
	const id = params.id;
	const db = platform.db;

	const fileService = new FileService(db);

	return new Response(JSON.stringify(await fileService.getInfo(id)))
}
