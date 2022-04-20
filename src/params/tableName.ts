/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	return !['login', 'signup', 'logout'].includes(param);
}
