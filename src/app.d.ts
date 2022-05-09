/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {}

	interface Platform {}

	interface Session {
		user: {
			username: string;
			email: string;
		};
	}

	interface Stuff {}
}
