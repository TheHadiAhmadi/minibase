// import adapter from '@sveltejs/adapter-node';
import adapter from 'svelte-adapter-deno-deploy';
import preprocess from 'svelte-preprocess';
import replace from 'esbuild-plugin-text-replace';
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
			serverFile: path.resolve('server/server.js'),
			out: './output/build',
			filesPrefix: './build',
			imports: {
				jsonwebtoken: 'https://dev.jspm.io/jsonwebtoken',
				crypto: 'https://deno.land/std/node/crypto.ts'
			},
			esbuild: (defaultOptions) => ({
				...defaultOptions,

				external: ['jsonwebtoken', 'crypto']
			})
		}),
		vite: {
			plugins: [windicss()],
			resolve: {
				alias: {
					$components: path.resolve('src/components')
				}
			}
		}
	}
};

export default config;
