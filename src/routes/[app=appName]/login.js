export async function post({ params }) {
	const app = params.app;
	console.log('login');
	return {
		body: 'login for ' + app
	};
}
