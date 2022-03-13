import { errorNotAuthorized, errorNotFound } from '$lib/errors';

export default class DataService {
	db = null;
	apiKey = null;
	app = null;
	table = null;

	async verifyAccess(key, method) {
		if (key?.rules[method] !== 'everyone') {
			throw errorNotAuthorized(`Your ApiKey does not have '${method}' access to this table`);
		}
	}

	async isPublic() {
		const [apps, tables] = await Promise.all([
			this.db.get('apps', { name: this.app, public: true }),
			this.db.get('tables', { appName: this.app, name: this.table, public: true })
		]);

		if (apps.length + tables.length === 2) {
			return true;
		}
		return false;
	}
	async hasAccess(method) {
		if (!this.apiKey) {
			if (method === 'get') {
				if (await this.isPublic()) return true;
			}

			throw errorNotFound('ApiKey Header not found');
		}

		const keys = await this.db.get('keys', { apiKey: this.apiKey, appName: this.app });

		return await this.verifyAccess(keys[0], method);
	}

	constructor(db, apiKey, app, table) {
		this.db = db;
		this.apiKey = apiKey;
		this.app = app;
		this.table = table;
	}

	async get() {
		await this.hasAccess('get');
		const data = await this.db.get('data', {
			appName: this.app,
			tableName: this.table
		});
		/// todo: pagination, filters...
		const tables = await this.db.get('tables', {
			appName: this.app,
			name: this.table
		});

		return {
			rows: tables[0].rows,
			values: data.map((d) => ({ ...d.value, id: d.id }))
		};
	}

	async update(id, newData) {
		await this.hasAccess('update');
		this.db.update(
			'data',
			{
				appName: this.app,
				tableName: this.table,
				id: id
			},
			newData
		);
	}

	async remove(id) {
		await this.hasAccess('remove');
		await this.db.remove('data', {
			appName: this.app,
			tableName: this.table,
			id: id
		});
		return true;
	}

	/** TODO: strictly typed */
	async insert(newData) {
		await this.hasAccess('insert');
		await this.db.insert('data', {
			appName: this.app,
			tableName: this.table,
			value: newData
		});
		return true;
	}
}
