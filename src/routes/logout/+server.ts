import { redirect } from '@sveltejs/kit'

/** @type {import('./logout').RequestHandler} */
export async function GET({setHeaders}) {
	console.log('logout')
	setHeaders({
		'set-cookie': ['token=; HttpOnly; Path=/'],
	})
	return new Response(null, {
		headers: {
			location: '/',
			'set-cookie': 'token=; HttpOnly; Path=/'
		},
		status: 307
	})
}
