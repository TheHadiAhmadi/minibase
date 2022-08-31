<script>
	import { goto } from '$app/navigation';

	import { SignupLoginForm } from '$lib/components';
	import { showInfo, showError } from '$lib/alerts';

	function handleError({ detail }) {
		showError(detail.message);
	}

	function signup({ detail }) {
        console.log('signup done')
		// showInfo(`Welcome ${detail.user.username}`);
		goto('/');
	}
</script>

<SignupLoginForm
	mode="signup"
	full
	on:login={() => goto('/login')}
	on:signup={signup}
	on:error={handleError}
/>
