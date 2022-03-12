// export const baseUrl = 'https://api-minibase.deno.dev';
export const baseUrl = 'http://minibase.deno.dev';
// export const baseUrl = '/api';
export function generateApiKey() {
	const result = Array.from({ length: 32 }, () => {
		const options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';
		const index = Math.floor(Math.random() * options.length);
		return options[index];
	}).join('');
	return result;
}
