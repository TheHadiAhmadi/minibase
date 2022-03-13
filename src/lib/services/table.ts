import { errorBadRequest, errorNotFound, errorResourceExists } from '$lib/errors';

export default class TableService {
	db = null;
	auth = null;
	appName = null;
	constructor(db, auth, appName) {
		this.db = db;
		this.auth = auth;
		this.appName = appName;
	}

	async getTable(name) {
		const tables = await this.db.get('tables', { appName: this.appName, name });
		if (tables.length === 0) throw errorNotFound('table not found');
		return tables[0];
	}

	async addTable({ name, isPublic, rows }) {
		const appName = this.appName;
		const user = await this.auth.getUser();

		if (!name || typeof isPublic === 'undefined' || rows.length === 0) {
			throw errorBadRequest('name, public and rows are required');
		}

		if (!Array.isArray(rows)) throw errorBadRequest('rows should be array');

		const existingTable = await this.db.get('tables', { appName, name });

		if (existingTable.length > 0) throw errorResourceExists('table with this name already exists');

		this.db.insert('tables', {
			appName,
			name,
			ownerId: user.id,
			public: isPublic,
			rows
		});

		return {
			appName,
			name,
			public: isPublic,
			rows
		};
	}

	async removeTable(name: string) {
		const user = await this.auth.getUser();
		const appName = this.appName;

		if (!name) throw errorBadRequest('name of table is required');

		await this.db.remove('tables', { appName, ownerId: user.id, name });
		await this.db.remove('data', { appName, tableName: name });

		return true;
	}

	async updateTable(tableName: string, { name, isPublic, rows }) {
		const appName = this.appName;
		const user = await this.auth.getUser();

		const tables = await this.db.get('tables', { ownerId: user.id, appName, name: tableName });
		if (tables.length === 0) throw errorNotFound('table not found');

		const data: any = {};
		if (name) data.name = name;
		if (isPublic === false || isPublic === true) data.public = isPublic;
		if (rows?.length > 0) data.rows = rows;

		await this.db.update(
			'tables',
			{
				ownerId: user.id,
				appName,
				name: tableName
			},
			{ name, isPublic, rows }
		);

		await this.db.update('data', { appName, tableName }, { tableName: name });
		return true;
	}
}
