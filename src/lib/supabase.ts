import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL not found');
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
if (!supabaseKey) throw new Error('VITE_SUPABASE_Key not found');

const client = createClient(supabaseUrl, supabaseKey);

export default client;

export async function getUserId(authorization) {
	authorization = authorization ?? '   ';
	const token = authorization.split(' ')[1];

	const user = await client.auth.api.getUser(token);
	if (!user) {
		return null;
	}

	return user.user?.id;
}
