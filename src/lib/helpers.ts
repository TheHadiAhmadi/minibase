import { dev } from '$app/env';
import { customAlphabet } from 'nanoid';

export const baseUrl = dev ? 'http://localhost:8000' : 'https://minibase.deno.dev';

export function nanoid(length) {
	const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const _nanoid = customAlphabet(alphabet, length);
	return _nanoid();
}

export function generateApiKey() {
	return nanoid(32);
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
