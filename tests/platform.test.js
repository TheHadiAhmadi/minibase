import platform from '$lib/platform';
import { expect, it } from 'vitest';
describe('in memory database', () => {
	let users = null;

	it('should return an array for get', async () => {
		users = await platform.db.get('users');

		expect(Array.isArray(users)).toBe(true);
	});

	it('should insert to a collection', async () => {
		await platform.db.insert('users', { id: 'test-id', test: 1, new: 'dssa' });
		await platform.db.insert('users', { id: 'test-id-2', test: 4, new: 'ddssa' });
		users = await platform.db.get('users');

		expect(users).toHaveLength(2);
		expect(users[0]).toMatchObject({ id: 'test-id', test: 1, new: 'dssa' });
	});

	it('should update collection', async () => {
		await platform.db.update('users', { id: 'test-id' }, { test: 2, newee: 'dssass' });
		users = await platform.db.get('users');
		expect(users[0]).toMatchObject({ id: 'test-id', test: 2, new: 'dssa', newee: 'dssass' });
	});

	it('should remove a collection', async () => {
		await platform.db.remove('users', { id: 'test-id' });
		users = await platform.db.get('users');
		expect(users).toHaveLength(1);
	});
});
