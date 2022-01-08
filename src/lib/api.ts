import { baseUrl } from '$lib';
import supabase from '$lib/supabase';

async function send(method, path, data) {

	const {access_token} = supabase.auth.session()

	const opts : any = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + access_token
		}
	};

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

export function post<T>(url, data) : Promise<T> {
	return send('POST', url, data);
}

export function put<T>(url, data) : Promise<T> {
	return send('PUT', url, data);
}

export function del<T>(url) : Promise<T> {
	return send('DELETE', url, null);
}
