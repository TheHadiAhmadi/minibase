import { generateApiKey } from '$lib/helpers';
import {
	errorBadRequest,
	errorNotAuthorized,
	errorNotFound,
	errorResourceExists
} from '$lib/services/errors';

export default class AppService {
	db = null;
	user = null;

	constructor(db, user) {
		this.db = db;
		this.user = user;
	}

	async getUser() {
		if (!this.user) throw errorNotAuthorized('you are not logged in');
		return this.user.id;
	}

	async getApps() {
		try {
			const ownerId = await this.getUser();
			return await this.db.get('apps', { ownerId });
		} catch (err) {
			return await this.db.get('apps', { public: true });
		}
	}

	async addApp({ name, description, isPublic }) {
		const ownerId = await this.getUser();
		if (!name || !description || typeof isPublic === 'undefined') throw errorBadRequest();

		const existingApp = await this.db.get('apps', { name });

		if (existingApp.length > 0) throw errorResourceExists('App with this name already exists');

		const newApp = {
			ownerId,
			name,
			description,
			public: isPublic
		};

		// insert app
		await this.db.insert('apps', newApp);

		const apiKey = {
			name: 'Full Access',
			appName: newApp.name,
			apiKey: generateApiKey(),
			rules: {
				get: 'everyone',
				insert: 'everyone',
				update: 'everyone',
				remove: 'everyone'
			}
		};
		await this.db.insert('keys', apiKey);

		return {
			data: {
				...newApp,
				apiKey
			}
		};
	}

	async getApiKeys(appName) {
		// TODO
		if (!appName) throw errorBadRequest();

		const ownerId = await this.getUser();

		const [apiKeys, apps] = await Promise.all([
			this.db.get('keys', { appName }),
			this.db.get('apps', { name: appName, ownerId })
		]);

		if (apps.length === 0 || apiKeys.length === 0) {
			return [];
		}

		if (apps[0].ownerId !== ownerId) {
			return [];
		}

		return apiKeys;
	}

	async getTables(appName) {
		if (!appName) throw errorBadRequest();

		try {
			const ownerId = await this.getUser();

			const [tables, apiKeys] = await Promise.all([
				this.db.get('tables', { ownerId, appName }),
				this.getApiKeys(appName)
			]);

			console.log({ tables, apiKeys });
			return {
				tables,
				apiKeys
			};
		} catch (err) {
			console.log(err);
			// check if public
			const [apps, tables] = await Promise.all([
				this.db.get('apps', { name: appName, public: true }),
				this.db.get('tables', { appName, public: true })
			]);

			console.log({ apps, appName, aspps: await this.db.get('apps') });
			if (apps.length > 0) {
				return {
					tables,
					apiKeys: []
				};
			} else throw errorNotAuthorized('this app does not exist or is not public');
		}
	}

	editApp({ userId, name, description, isPublic }) {
		console.log('TODO');
	}
}
