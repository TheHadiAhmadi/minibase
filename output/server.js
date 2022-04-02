import handler from './build/handler.js';
import platform from './platform.ts';

const port = Deno.env.get('PORT') ?? 3000;

const hostname = Deno.env.get('HOST') ?? 'localhost';

const server = Deno.listen({ port, hostname });
console.log(`server is running at ${hostname}:${port}`);

const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers':  'Authorization, Content-Type, ApiKey',
		'Access-Control-Allow-Methods':  'POST, GET, OPTIONS, PUT',

}

for await (const conn of server) {
	for await (const { request, respondWith } of Deno.serveHttp(conn)) {
		console.log(request.url);
		if(request.method === 'OPTIONS') {
			respondWith(new Response('', {status: 200, headers}))
		} else {
			respondWith(handler(request, platform));
		}
	}
}
