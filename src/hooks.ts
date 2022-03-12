import { browser } from '$app/env';
import { AuthService } from '$lib/services';
import platform from '$lib/platform.js';

function getToken(authorization) {
	if (!authorization) {
		return null;
	}
	return authorization.split(' ')[1];
}

export async function handle({ event, resolve }) {
	if (typeof event.platform === 'undefined') {
		event.platform = platform;
	}

	const authorization = event.request.headers.get('authorization');
	const token = getToken(authorization);

	const authService = new AuthService(event.platform.db, token);

	let body = {};

	if (event.request.method !== 'GET') body = await event.request.json();

	event.locals.auth = authService;
	event.locals.body = body;

	try {
		return await resolve(event);
	} catch (err) {
		const response = {
			status: err.status,
			message: err.message
		};
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' },
			status: response.status
		});
	}
}
