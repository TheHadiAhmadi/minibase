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

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest;
	describe('helpers', () => {
		it('should generate 32 character random string', () => {
			const key1 = generateApiKey();
			const key2 = generateApiKey();
			expect(key1).not.toBe(key2);
			expect(key1.length).toBe(32);
		});
	});
}
