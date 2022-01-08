import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import windicss from 'vite-plugin-windicss';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
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
