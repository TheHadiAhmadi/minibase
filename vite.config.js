import { sveltekit } from '@sveltejs/kit/vite';
import windicss from 'vite-plugin-windicss';

export default {
	plugins: [windicss(), sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		includeSource: ['src/**/*.{js,ts,svelte}']
	}
};
