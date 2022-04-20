import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
	errorBadRequest,
	errorJWT,
	errorNotFound,
	errorNotImplemented,
	errorResourceExists
} from './errors';

export type User = {
	id: string;
	username: string;
	email: string;
};

async function hashPassword(str: string): Promise<string> {
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
	token = null;
	secret = null;
	constructor(db, token, secret) {
		this.db = db;
		this.token = token;
		this.secret = secret;
	}

	async createAccessToken(user: User): Promise<string> {
		try {
			return jwt.sign({ user }, this.secret, { expiresIn: '60m' });
		} catch (err) {
			console.log(err);
			return;
		}
	}

	async getUser() {
		try {
			const payload = await jwt.verify(this.token, this.secret);

			if (payload.user) return payload.user;
			console.log(payload);

			if (payload)
				return {
					username: payload.username,
					id: payload.id,
					email: payload.email
				};
			return null;
		} catch (err) {
			throw errorJWT(err);
		}
	}

	async signup({ email, username, password }) {
		if (!email || !username || !password) {
			throw errorBadRequest('email, username and password are required');
		}

		const existingUser = await this.db.get('users', { username });
		if (existingUser.length > 0) {
			throw errorResourceExists('Username taken.');
		}

		const user = {
			id: uuid(),
			username,
			email
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

	async login({ username, password }) {
		const users = await this.db.get('users', { username });

		if (!username || !password) {
			throw errorBadRequest('username and password are required');
		}

		// check if user exists
		if (users.length !== 1) {
			throw errorNotFound('Account with this username not exists');
		}

		// check password
		if (users[0].password !== (await hashPassword(password))) {
			throw errorBadRequest('Invalid password');
		}

		const payload = {
			id: users[0].id,
			username: users[0].username,
			email: users[0].email
		};

		const access_token = await this.createAccessToken(payload);

		return {
			access_token,
			user: payload
		};
	}

	async updateUser({ username, email, password, old_password }) {
		const data: any = {};
		const user = await this.getUser();

		if (username) {
			data.username = username;
			const theUser = await this.db.get('users', { username });
			if (theUser.length > 0) {
				throw errorResourceExists('Username taken');
			}
		}

		if (email) {
			data.email = email;
		}

		if (password && !old_password)
			throw errorBadRequest('For changing password, you should provide old_password');

		const users = await this.db.get('users', { id: user.id });

		if (password) {
			if ((await hashPassword(old_password)) !== users[0].password)
				throw errorBadRequest('Old passwords does not match');

			data.password = await hashPassword(password);
		}

		await this.db.update('users', { id: user.id }, data);

		return {
			user: await this.db.get('users', { id: user.id }),
			updated: Object.keys(data).join(', ')
		};
	}

	logout() {
		throw errorNotImplemented();
	}
}
