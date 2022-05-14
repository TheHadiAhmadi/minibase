import { errorNotAuthorized, errorNotFound } from '$lib/services/errors';

export default class DataService {
	db = null;
	apiKey = null;
	app = null;
	table = null;

	async verifyAccess(key, method) {
		console.log({ key, method });
		if (!key || key?.rules[method] !== 'everyone') {
			throw errorNotAuthorized(`Your ApiKey does not have '${method}' access to this table`);
		}
		return true;
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
		try {
			if (!this.apiKey) {
				if (method === 'get') {
					if (await this.isPublic()) return true;
				}

				throw errorNotFound('ApiKey Header not found');
			}

			const keys = await this.db.get('keys', { apiKey: this.apiKey, appName: this.app });

			if(keys.length < 1) throw errorNotAuthorized('apikey header not found')
			return await this.verifyAccess(keys[0], method);
		} catch (err) {
			throw err;
			return false;
		}
	}

	constructor(db, apiKey, app, table) {
		this.db = db;
		this.apiKey = apiKey;
		this.app = app;
		this.table = table;
	}

	async get(id = null) {
		await this.hasAccess('get');
		const dataQuery: any = {
			appName: this.app,
			tableName: this.table
		};
		if (id !== null) dataQuery.id = id;

		console.log({ dataQuery });
		const data = await this.db.get('data', dataQuery);
		console.log({ data });

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
		console.log('here 1');
		if(!await this.hasAccess('update')) throw errorNotAuthorized('you cannot do this')
		console.log('here 2');
		const dataQuery = {
			appName: this.app,
			tableName: this.table,
			id: id
		};
		console.log({ dataQuery });
		const existingData = await this.db.get('data', dataQuery);
		if (existingData.length < 1) throw errorNotFound('data with this id not found');
		console.log({ existingData });

		this.db.update('data', dataQuery, {
			value: { ...existingData[0], ...newData }
		});
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
	async insert(id, newData) {
		await this.hasAccess('insert');
		await this.db.insert('data', {
			id: id,
			appName: this.app,
			tableName: this.table,
			value: newData
		});
		return true;
	}
}
