<script>
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';

	import { SignupForm } from '$lib/components';
	import { showInfo, showError } from '$lib/alerts';

	function updateSession(sess) {
		localStorage.setItem('mb-session', JSON.stringify(sess));
		$session = sess;
	}

	function handleError({ detail }) {
		showError(detail.message);
	}
	
	function signup({ detail }) {
		showInfo("Welcome USER");
		updateSession(detail);
		goto('/');
	}
</script>

<SignupForm full on:signup={signup} on:error={handleError} />
