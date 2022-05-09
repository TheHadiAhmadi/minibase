<script>
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';

	import { showError } from '$lib/alerts';

	import { LoginForm } from '$lib/components';

	function login({ detail }) {
		goto('/');
	}
</script>

<LoginForm full on:login={login} on:error={({ detail }) => showError(detail.message)} />
