import { browser } from '$app/env';
import { baseUrl } from '$lib/helpers';

function getToken() {
	const session = browser && JSON.parse(localStorage.getItem('mb-session'));
	if (session?.access_token) {
		return 'Bearer ' + session.access_token;
		// opts.headers.Authorization = 'Bearer ' + session.access_token;
	}
	return null;
}

if (import.meta.vitest) {
	describe('getToken', () => {
		it('should return null or a string', () => {
			const token = getToken();
			if (token) {
				expect(token).toBeTypeOf('string');
				expect(token).toContain('Bearer ');
			} else {
				expect(token).toBeNull();
			}
		});
	});
}

async function send(method, path, data, headers) {
	const opts: any = {
		headers: {
			...headers,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	};

	if (['POST', 'PUT', 'DELETE'].includes(method)) {
		opts.method = method;
		opts.body = {}; // default body for non-get methods
	}

	if (data) {
		opts.body = JSON.stringify(data);
	}

	try {
		const res = await fetch(baseUrl + path, opts);
		return res.json();
	} catch (err) {
		console.log('CAUGHT', err);
	}
}

export function get<T>(url, headers): Promise<T> {
	return send('GET', url, null);
}

export function post<T>(url, data, headers): Promise<T> {
	return send('POST', url, data, headers);
}

export function put<T>(url, data, headers): Promise<T> {
	return send('PUT', url, data, headers);
}

export function del<T>(url, headers): Promise<T> {
	return send('DELETE', url, null, headers);
}
