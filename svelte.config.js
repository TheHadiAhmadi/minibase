import adapter from '@sveltejs/adapter-vercel';
// import adapter from 'svelte-adapter-deno-deploy2';
import preprocess from 'svelte-preprocess';
// import windicss from 'vite-plugin-windicss';
import path from 'path';

/**@type {import('@sveltejs/kit').Config} */
export default {
	preprocess: preprocess(),
	kit: {
		adapter: adapter({
			// serverFile: path.resolve('output/server.js'),
			// out: './output/build',
			// filesPrefix: './build',
			// imports: {
			// 	jsonwebtoken: 'https://jspm.dev/jsonwebtoken@8.5.1',
			// 	crypto: 'https://deno.land/std/node/crypto.ts',
			// 	nanoid: 'https://deno.land/x/nanoid/mod.ts'
			// }
		})
	}
}