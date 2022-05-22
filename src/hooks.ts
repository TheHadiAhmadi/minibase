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
	if (token) event.locals.token = token;

	const dark = cookies.dark ?? false;
	event.locals.dark = !!dark;

	const secret = event.platform.secret || 'dev-secret';
	if (secret) event.locals.secret = secret;

	try {
		const user = await AuthService.getUser(token, secret);

		if (user) {
			event.locals.user = {
				id: user.id,
				username: user.username,
				email: user.data?.email ?? user.email // fallback
			};
		}
	} catch (err) {
		console.log("ERROR", err)
	}

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
		console.log(err);
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' },
			status: response.status
		});
	}
}

export async function getSession(event) {
	const { user, dark } = event.locals;
	console.log({user, dark})

	if (!user) {
		return {
			user: null,
			dark
		};
	}

	return {
		user: {
			email: user.email,
			username: user.username
		},
		dark
	};
}
