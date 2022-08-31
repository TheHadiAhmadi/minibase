import { getAppName } from '$lib/helpers';

export async function load({ request, locals }) {
	return {
		user: locals.user,
		token: locals.token,
		dark: locals.dark,
		appName: getAppName(request.url)
	};
}
