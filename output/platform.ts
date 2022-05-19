import initializeDB from './database.ts';
import { env, Bson } from './deps.ts';

export default {
	db: {
		async get(collection, filters) {
			const db = await initializeDB();
			console.log('Override GET', collection, filters);

			return await db.find(collection, filters);
		},

		async update(collection, filters: any, data: any) {
			const db = await initializeDB();
			console.log('Override UPDATE', collection, filters, data);
			await db.update(collection, filters, data);
			return true;
		},

		async remove(collection, filters: any) {
			const db = await initializeDB();
			console.log('Override remove', collection, filters);
			await db.remove(collection, filters);
			return true;
		},

		async insert(collection, data: any) {
			const db = await initializeDB();
			console.log('Override INSERT', collection, data);
			await db.insert(collection, data);
			return true;
		},
		serialize: Bson.serialize,
		deserializeStream: Bson.deserializeStream,
		deserialize: Bson.deserialize
	},
	secret: env.ACCESS_TOKEN_SECRET
};
