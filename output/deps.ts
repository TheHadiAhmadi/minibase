export { MongoClient } from 'https://deno.land/x/mongo@v0.29.0/mod.ts';

// load .env file
import 'https://deno.land/x/dotenv/load.ts';

export const MONGODB_URL = Deno.env.get('VITE_MONGODB_URL');
if (!MONGODB_URL) throw new Error('VITE_MONGODB_URL not found');

export const env = {
	MONGODB_URL
};
