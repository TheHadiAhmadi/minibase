import { dev } from '$app/environment';
import { customAlphabet } from 'nanoid';

export const baseUrl = (appName = '') => {

	if(appName) {
	return dev ? `http://${appName}.localhost:8000` : `https://${appName}.theminibase.com`;
	} else {
		return dev ? 'http://localhost:8000' : 'https://theminibase.com'
	}
} 

export function nanoid(length) {
	const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const _nanoid = customAlphabet(alphabet, length);
	return _nanoid();
}

export function getAppName(url) {
    let appName
    const segments = new URL(url).hostname.split('.')
    if(segments.length == 2 && dev || segments.length === 3 && !dev) {
        appName = segments[0]
    }
    return appName
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
