/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	return !['login', 'signup', 'logout', 'apps', 'new', 'settings'].includes(param);
}
