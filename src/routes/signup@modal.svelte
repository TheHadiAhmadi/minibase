<script>
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';

	import { SignupForm } from '$lib/components';
	import { showAlert } from '$lib/errors';

	function updateSession(sess) {
		localStorage.setItem('mb-session', JSON.stringify(sess));
		$session = sess;
	}

	function handleError({ detail }) {
		showAlert(detail.message);
	}

	function signup({ detail }) {
		updateSession(detail);
		goto('/');
	}
</script>

<SignupForm full on:signup={signup} on:error={handleError} />
