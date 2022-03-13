// import { browser } from '$app/env';
import { baseUrl } from '$lib';

// function getToken() {
// 	const session = browser && JSON.parse(localStorage.getItem('mb-session'));
// 	if (session?.access_token) {
// 		return 'Bearer ' + session.access_token;
// 		// opts.headers.Authorization = 'Bearer ' + session.access_token;
// 	}
// 	return null;
// }

export default class ApiService {
	apiKey = null;
	token = null;
	baseUrl = null;
	constructor({ base = baseUrl, apiKey = '', token = '' } = {}) {
		this.baseUrl = base;
		this.token = token;
		this.apiKey = apiKey;
	}

	async send(method, path, data) {
		const opts: any = {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		};
		console.log('send', this.apiKey, this.baseUrl, this.token, method, path, data);

		if (this.token) {
			opts.headers.Authorization = this.token;
		}

		if (this.apiKey) {
			opts.headers.ApiKey = this.apiKey;
		}

		if (['POST', 'PUT', 'DELETE'].includes(method)) {
			opts.method = method;
		}

		if (data) {
			opts.body = JSON.stringify(data);
		}

		const res = await fetch(this.baseUrl + path, opts);
		return res.json();
	}

	get<T>(url): Promise<T> {
		return this.send('GET', url, null);
	}

	post<T>(url, data): Promise<T> {
		return this.send('POST', url, data);
	}

	put<T>(url, data): Promise<T> {
		return this.send('PUT', url, data);
	}

	del<T>(url): Promise<T> {
		return this.send('DELETE', url, null);
	}
}
