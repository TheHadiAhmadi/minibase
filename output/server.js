import handler from './build/handler.js';
import platform from './platform.ts';

const port = Deno.env.get('PORT') ?? 3000;

const hostname = Deno.env.get('HOST') ?? 'localhost';

const server = Deno.listen({ port, hostname });
console.log(`server is running at ${hostname}:${port}`);

for await (const conn of server) {
	for await (const { request, respondWith } of Deno.serveHttp(conn)) {
		respondWith(handler(request, platform));
	}
}
