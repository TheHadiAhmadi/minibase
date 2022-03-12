/// <reference types="@sveltejs/kit" />

import type { getUser } from '$lib/services/auth';

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
