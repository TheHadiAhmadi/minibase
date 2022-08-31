import { getAppName } from '$lib/helpers';
import { AppService, errorResponse, TableService } from '$lib/services';

async function addTableController({ db, user, body, appName }) {
	const tableService = new TableService(db, user, appName);
	const { name, public: isPublic = false, rows } = body;

	await tableService.addTable({ name, isPublic, rows });
	return new Response(JSON.stringify({ status: 201, success: true }));
}
async function addAppController({ db, user, body }) {
	const appService = new AppService(db, user);
	const { name, description, public: isPublic } = body;

	const data = await appService.addApp({
		name,
		description,
		isPublic
	});

	return new Response(JSON.stringify({status: 201, success: true }), {
		headers: {
			'set-cookie': `token={};Path=/; HttpOnly; Domain=${name}.localhost;`
		}
	})
}

export async function POST({ params, request, platform, locals }) {
	const db = platform.db;
	const user = locals.user;
	const body = await request.json();
	const appName = getAppName(request.url);

	try {
		if (appName) {
			return addTableController({ db, user, appName, body });
		} else {
			return addAppController({ db, user, body });
		}
	} catch (err) {
		return errorResponse(err)
	}
}
