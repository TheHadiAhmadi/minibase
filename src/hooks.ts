export async function handle({ event, resolve }) {
	const { pathname } = new URL(event.request.url);
	if (pathname.startsWith('/api/')) {
		return new Response('you cannot use /api in dev mode ');
	} else {
		return await resolve(event);
	}
}
