import { generateApiKey } from '$lib';
import { errorBadRequest, errorResourceExists } from '$lib/errors';

export default class AppService {
	db = null;
	auth = null;

	constructor(db, auth) {
		this.db = db;
		this.auth = auth;
	}
	async getApps() {
		try {
			const user = await this.auth.getUser();
			return await this.db.get('apps', { ownerId: user.id });
		} catch (err) {
			return await this.db.get('apps', { public: true });
		}
	}

	async addApp({ name, description, isPublic }) {
		const user = await this.auth.getUser();
		if (!name || !description || typeof isPublic === 'undefined') throw errorBadRequest();

		const existingApp = await this.db.get('apps', { name });

		if (existingApp.length > 0) throw errorResourceExists('App with this name already exists');

		const newApp = {
			ownerId: user.id,
			name: name,
			description: description,
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

		const user = await this.auth.getUser();

		const [apiKeys, apps] = await Promise.all([
			this.db.get('keys', { appName }),
			this.db.get('apps', { name: appName })
		]);

		console.log(apiKeys, apps);

		if (apps.length === 0 || apiKeys.length === 0) {
			return [];
		}

		if (apps[0].ownerId !== user.id) {
			return [];
		}

		return apiKeys;
	}

	async getTables(appName) {
		// TODO

		if (!appName) throw errorBadRequest();

		const tables = await this.db.get('tables', { appName });

		return tables;
	}

	editApp({ userId, name, description, isPublic }) {
		console.log('TODO');
	}
}