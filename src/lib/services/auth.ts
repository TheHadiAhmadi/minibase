import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
	errorBadRequest,
	errorJWT,
	errorNotAuthorized,
	errorNotFound,
	errorNotImplemented,
	errorResourceExists
} from './errors';

export type User = {
	id: string;
	username: string;
	[x: string]: any;
};

export async function hashPassword(str: string): Promise<string> {
	if (str) {
		return crypto.createHash('sha256').update(str).digest('hex');
	}
	throw new Error('empty password');
}

export function uuid() {
	return crypto.randomUUID();
}

export default class AuthService {
	db = null;
	token: string = null;
	secret: string = null;
	constructor(db, token: string, secret: string) {
		this.db = db;
		this.token = token;
		this.secret = secret;
	}

	async verifyApiKeyAccess(appName, apiKey) {
		const apiKeys = await this.db.get('keys', { appName, apiKey });

		if (apiKeys.length < 1) throw errorNotAuthorized();
	}

	async createAccessToken(user: User): Promise<string> {
		try {
			return jwt.sign({ user }, this.secret, { expiresIn: '60m' });
		} catch (err) {
			// console.log(err);
			return;
		}
	}

	static async getUser(token: string, secret: string): Promise<User> {
		try {
			if (!token) return null;
			const payload = await jwt.verify(token, secret);

			if (payload.user)
				return {
					id: payload.user.id,
					username: payload.user.username,
					data: payload.user.data
				};

			if (payload)
				return {
					id: payload.id,
					username: payload.username,
					data: payload.data
				};

			console.log({ payload });
			return null;
		} catch (err) {
			throw errorJWT(err);
		}
	}

	async signup(appName, username, password, data) {
		if (!username || !password) {
			throw errorBadRequest('username and password are required');
		}

		let existingUser;
		if (!appName) {
			existingUser = await this.db.get('users', { username });
			existingUser = existingUser.filter((user) => !user.appName);
		} else {
			existingUser = await this.db.get('users', { username, appName });
		}

		if (existingUser.length > 0) {
			throw errorResourceExists('Username is Not available');
		}

		const user = {
			id: uuid(),
			username,
			data
		};

		await this.db.insert('users', {
			...user,
			password: await hashPassword(password)
		});

		const access_token = await this.createAccessToken(user);

		return {
			access_token,
			user
		};
	}

	async login(appName, username, password) {
		if (!username || !password) {
			throw errorBadRequest('username and password are required');
		}

		let users;

		if (!appName) {
			users = await this.db.get('users', { username }); // TODO
			users = users.filter((user) => !user.appName);
		} else {
			users = await this.db.get('users', { username, appName });
		}

		// check if user exists
		if (users.length < 1) {
			throw errorNotFound('Account with this username not exists');
		}

		// check password
		if (users[0].password !== (await hashPassword(password))) {
			throw errorBadRequest('Invalid password');
		}

		const payload = {
			id: users[0].id,
			username: users[0].username,
			data: users[0].data
		};

		const access_token = await this.createAccessToken(payload);

		return {
			access_token,
			user: payload
		};
	}

	async updateUser({ username, password, old_password, data }) {
		const user = await AuthService.getUser(this.token, this.secret);
		const query: Partial<User> = {};

		if (username) {
			query.username = username;
			const users = await this.db.get('users', { username });
			if (users.length > 0) {
				throw errorResourceExists('Username taken');
			}
		}
		// update data

		if (password && !old_password)
			throw errorBadRequest('For changing password, you should provide old_password');

		const users = await this.db.get('users', { id: user.id });

		if (password) {
			if ((await hashPassword(old_password)) !== users[0].password)
				throw errorBadRequest('Old passwords does not match');

			query.password = await hashPassword(password);
		}

		query.data = { ...user.data, data };

		await this.db.update('users', { id: user.id }, query);

		data.username = username;
		data.password = password;

		return {
			user: await this.db.get('users', { id: user.id }),
			updated: Object.keys(data).filter(Boolean).join(', ')
		};
	}

	logout() {
		throw errorNotImplemented();
	}
}
