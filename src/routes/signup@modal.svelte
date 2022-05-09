
<script>
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';

	import { SignupForm } from '$lib/components';
	import { showInfo, showError } from '$lib/alerts';

	function handleError({ detail }) {
		showError(detail.message);
	}

	function signup({ detail }) {
		showInfo('Welcome USER');
		goto('/');
	}
</script>

<SignupForm full on:signup={signup} on:error={handleError} />
