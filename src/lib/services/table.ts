import { errorBadRequest, errorNotFound, errorResourceExists } from '$lib/services/errors';
import { errorNotAuthorized } from '.';

export default class TableService {
	db = null;
	user = null;
	appName = null;
	constructor(db, user, appName) {
		this.db = db;
		this.user = user;
		this.appName = appName;
	}

	getUser() {
		if (!this.user) throw errorNotAuthorized('you are not logged in');
		return this.user;
	}

	async getTable(name) {
		const tables = await this.db.get('tables', { appName: this.appName, name });
		if (tables.length === 0) {
			throw errorNotFound('table not found');
		}
		return tables[0];
	}

	async addTable({ name, isPublic, rows }) {
		const appName = this.appName;
		const user = await this.getUser();

		if (!name || typeof isPublic === 'undefined' || rows.length === 0) {
			throw errorBadRequest('name, public and rows are required');
		}

		if (['signup', 'login', 'logout', 'files'].includes(name))
			throw errorBadRequest(`${name} is not a valid Table name`);

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
		const user = await this.getUser();
		const appName = this.appName;

		if (!name) throw errorBadRequest('name of table is required');

		await this.db.remove('tables', { appName, ownerId: user.id, name });
		await this.db.remove('data', { appName, tableName: name });

		return true;
	}

	async updateTable(tableName: string, { name, isPublic, rows }) {
		const appName = this.appName;
		const user = await this.getUser();

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
