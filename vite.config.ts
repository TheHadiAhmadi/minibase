import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import windicss from 'vite-plugin-windicss';

import autoImport from 'sveltekit-autoimport'
import {ubeacComponents} from './ubeacComponents.js'

const config: UserConfig = {
	plugins: [
		autoImport({
			components: ['./src/components', '@ubeac/svelte/components'],
			module: {
				'@ubeac/svelte': ubeacComponents.filter((component) => !['Page'].includes(component)),
			},
		}),
		windicss(), sveltekit()]
};

export default config;
