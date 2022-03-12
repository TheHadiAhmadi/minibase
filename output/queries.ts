// deno-lint-ignore-file no-explicit-any

import type { Database, MongoClient } from './deps.ts';

export default class DatabaseQuery {
	client: MongoClient;
	db: Database;
	log = (...a: any[]) => {
		console.log(a);
	};

	constructor(client: MongoClient, log = console.log) {
		this.client = client;
		this.db = client.database();
		this.log = log;
	}

	async find(collection: string, filter: any = {}) {
		const result = await this.db
			.collection(collection)
			.find(filter, {
				noCursorTimeout: false,
				projection: { _id: 0 }
			})
			.toArray();

		this.log('find: ', { collection, filter, result });
		return result;
	}

	async insert(collection: string, data: any) {
		data.id = crypto.randomUUID();

		let result;
		if (Array.isArray(data)) {
			result = await this.db.collection(collection).insertMany(data);
		} else {
			result = await this.db.collection(collection).insertOne(data);
		}
		this.log('insert', { collection, data, result });
		// return result;
		return true;
	}

	async remove(collection: string, filters: any) {
		const result = await this.db.collection(collection).deleteMany(filters);
		this.log('delete, ', { collection, filters, result });
		return true;
	}

	async update(collection: string, filters: any, value: any) {
		const data = await this.find(collection, filters);
		if (data.length === 0) {
			throw new Error('not found');
		}

		const result = await this.db.collection(collection).updateMany(filters, {
			$set: value
		});

		this.log('update: ', { collection, filters, value, result });
		return true;
	}

	close() {
		this.client.close();
	}
}
