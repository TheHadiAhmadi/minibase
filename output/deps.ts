export { Bson, MongoClient } from 'https://deno.land/x/mongo@v0.29.0/mod.ts';

// load .env file
import 'https://deno.land/x/dotenv/load.ts';

export const ACCESS_TOKEN_SECRET = Deno.env.get('VITE_ACCESS_TOKEN_SECRET');
if (!ACCESS_TOKEN_SECRET) throw new Error('VITE_ACCESS_TOKEN_SECRET not found');

export const MONGODB_URL = Deno.env.get('VITE_MONGODB_URL');
if (!MONGODB_URL) throw new Error('VITE_MONGODB_URL not found');

export const env = {
	MONGODB_URL,
	ACCESS_TOKEN_SECRET
};
