import { dev } from '$app/env';

export const baseUrl = dev ? 'http://localhost:8000' : 'https://minibase.deno.dev';

export function generateApiKey() {
	const result = Array.from({ length: 32 }, () => {
		const options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';
		const index = Math.floor(Math.random() * options.length);
		return options[index];
	}).join('');
	return result;
}
