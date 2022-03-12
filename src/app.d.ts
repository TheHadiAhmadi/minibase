/// <reference types="@sveltejs/kit" />

import type { getUser } from '$lib/services/auth';

interface ImportMetaEnv {
	VITE_ACCESS_TOKEN_SECRET?: string;
	VITE_REFERSH_TOKEN_SECRET?: string;
}

declare namespace App {
	interface Locals {}

	interface Platform {}

	interface Session {
		access_token: string;
		user: {
			id: string;
			username: string;
			email: string;
		};
	}

	interface Stuff {}
}
