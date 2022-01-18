import { baseUrl } from '$lib';
import supabase from '$lib/supabase';

async function send(method, path, data) {

	const session = supabase.auth.session()

	let access_token = null

	if(session) {
		// load public data

		access_token = session.access_token
	}

	const opts : any = {
		headers: {
			'Content-Type': 'application/json',
		}
	};

	if(access_token) {
		opts.headers.Authorization = 'Bearer ' + access_token
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

export function post<T>(url, data) : Promise<T> {
	return send('POST', url, data);
}

export function put<T>(url, data) : Promise<T> {
	return send('PUT', url, data);
}

export function del<T>(url) : Promise<T> {
	return send('DELETE', url, null);
}
