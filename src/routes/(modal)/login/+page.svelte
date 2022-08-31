<script>
	import { goto } from '$app/navigation';

	import { showError } from '$lib/alerts';

	import { SignupLoginForm } from '$lib/components';
	
	function login({ detail }) {
		goto('/');
	}

</script>
<SignupLoginForm
	full
	mode="login"
	on:login={login}
	on:error={({ detail }) => showError(detail.message)}
/>
