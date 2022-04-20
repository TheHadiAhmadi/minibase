import { extractFromSvelteConfig } from 'vitest-svelte-kit';

console.log(await extractFromSvelteConfig());
export default extractFromSvelteConfig();
