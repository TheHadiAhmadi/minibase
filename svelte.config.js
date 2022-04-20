// import adapter from '@sveltejs/adapter-node';
import adapter from 'svelte-adapter-deno-deploy';
import preprocess from 'svelte-preprocess';
import windicss from 'vite-plugin-windicss';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// adapter: adapter(),
		adapter: adapter({
			serverFile: path.resolve('output/server.js'),
			out: './output/build',
			filesPrefix: './build',
			imports: {
				jsonwebtoken: 'https://dev.jspm.io/jsonwebtoken',
				crypto: 'https://deno.land/std/node/crypto.ts'
			}
		}),
		vite: {
			plugins: [windicss()],
			test: {
				globals: true,
				environment: 'jsdom'
			}
		}
	}
};

export default config;
