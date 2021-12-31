import database from '$lib/db';
import { v4 as uuid } from 'uuid';

export async function find(collection, filter) {
	const db = await (await database).db('mainDatabase');
	const result = await db
		.collection(collection)
		.find(filter ?? {}, { projection: { _id: 0 } })
		.toArray();
	console.log('find: ', { collection, filter, result });
	return result;
}

export async function insert(collection, data) {
	const db = await (await database).db('mainDatabase');

	data.id = uuid();

	let result;
	if (Array.isArray(data)) {
		result = await db.collection(collection).insertMany(data);
	} else {
		result = await db.collection(collection).insertOne(data);
	}
	console.log('insert', { collection, data, result });
	return result;
}

export async function remove(collection, id) {
	const db = await (await database).db('mainDatabase');

	const result = await db.collection(collection).deleteMany({ id });
	console.log('delete, ', { collection, id, result });
	return result;
}

export async function update(collection, id, value) {
	const db = await (await database).db('mainDatabase');

	const result = await db.collection(collection).updateMany({ id }, { $set: value });
	console.log('update: ', { collection, id, value, result });
	return result;
}
