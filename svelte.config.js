// // import adapter from '@sveltejs/adapter-node';
import adapter from 'svelte-adapter-deno-deploy2';
import preprocess from 'svelte-preprocess';
// import windicss from 'vite-plugin-windicss';
import path from 'path';

/**@type {import('@sveltejs/kit').Config} */
export default {
	preprocess: preprocess(),
	kit: {
		adapter: adapter({
			serverFile: path.resolve('output/server.js'),
			out: './output/build',
			filesPrefix: './build',
			imports: {
				jsonwebtoken: 'https://jspm.dev/jsonwebtoken@8.5.1',
				crypto: 'https://deno.land/std/node/crypto.ts',
				nanoid: 'https://deno.land/x/nanoid/mod.ts'
			}
		})
	}
}


// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	// Consult https://github.com/sveltejs/svelte-preprocess
// 	// for more information about preprocessors
// 	preprocess: preprocess(),

// 	kit: {
// 		// adapter: adapter(),
// 		adapter: adapter({
// 			serverFile: path.resolve('output/server.js'),
// 			out: './output/build',
// 			filesPrefix: './build',
// 			imports: {
// 				jsonwebtoken: 'https://jspm.dev/jsonwebtoken@8.5.1',
// 				crypto: 'https://deno.land/std/node/crypto.ts',
// 				nanoid: 'https://deno.land/x/nanoid/mod.ts'
// 			}
// 		}),
// 		vite: {
// 			plugins: [windicss()],
// 			test: {
// 				globals: true,
// 				environment: 'jsdom',
// 				includeSource: ['src/**/*.{js,ts,svelte}']
// 			}
// 		}
// 	}
// };

// export default config;
