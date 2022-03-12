import { browser } from '$app/env';
import { baseUrl } from '$lib';

function getToken() {
	const session = browser && JSON.parse(localStorage.getItem('mb-session'));
	if (session?.access_token) {
		return 'Bearer ' + session.access_token;
		// opts.headers.Authorization = 'Bearer ' + session.access_token;
	}
	return null;
}

async function send(method, path, data) {
	const opts: any = {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	};

	const token = getToken();

	if (token) {
		opts.headers.Authorization = token;
	}

	if (['POST', 'PUT', 'DELETE'].includes(method)) {
		opts.method = method;
	}

	if (data) {
		opts.body = JSON.stringify(data);
	}

	const res = await fetch(baseUrl + path, opts);
	return res.json();
}

export function get<T>(url): Promise<T> {
	return send('GET', url, null);
}

export function post<T>(url, data): Promise<T> {
	return send('POST', url, data);
}

export function put<T>(url, data): Promise<T> {
	return send('PUT', url, data);
}

export function del<T>(url): Promise<T> {
	return send('DELETE', url, null);
}
