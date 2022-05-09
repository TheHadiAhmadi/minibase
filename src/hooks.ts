import { browser } from '$app/env';
import { parse } from 'cookie';
import { AuthService } from '$lib/services';
import platform from '$lib/platform.js';
import type { User } from '$lib/services/auth';

export async function handle({ event, resolve }) {
	if (typeof event.platform === 'undefined') {
		event.platform = platform;
	}

	const cookies = parse(event.request.headers.get('cookie') || '');

	const token = cookies.token ?? null;
	
	const secret = event.platform.secret || 'dev-secret';
	
	const authService = new AuthService(event.platform.db, token, secret);
	try {
		const user = await authService.getUser();

		if(user) {

			event.locals.user = {
				username: user.username,
				email: user.email
			}
		}
	} catch(err) {
		// console.log("ERROR", err)
	}


	if (event.request.method !== 'GET' && event.request.method !== 'DELETE') {
		event.locals.body = await event.request.json();
	}

	event.locals.auth = authService;

	try {
		const response = await resolve(event, { ssr: () => false });

		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, ApiKey');
		response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');

		return response;
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

export async function getSession(event) {
	const { user } = event.locals;

	return { user };
}
