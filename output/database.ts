import { env, MongoClient } from './deps.ts';
import DatabaseQuery from './queries.ts';

let client: MongoClient | null = null;

export default async function initializeDB() {
	if (!client) {
		client = new MongoClient();

		try {
			await client.connect(env.MONGODB_URL);
		} catch (err) {
			console.log('Cannot connect to database');
			console.log(err);
		}
	}

	// second parameter is logger function
	const query = new DatabaseQuery(client, () => {});

	return query;
}
