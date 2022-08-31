import { FileService } from '$lib/services';

export async function GET({ platform, params }) {
	const db = platform.db;
	const id = params.id;

	const fileService = new FileService(db);

	return new Response(await fileService.download(id))
}
