<script>
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';

	import { showAlert } from '$lib/errors';

	import { LoginForm } from '$lib/components';

	export function updateSession(sess) {
		localStorage.setItem('mb-session', JSON.stringify(sess));
		$session = sess;
	}

	function login({ detail }) {
		updateSession(detail);
		goto('/');
	}
</script>

<LoginForm full on:login={login} on:error={({ detail }) => showAlert(detail.message)} />
