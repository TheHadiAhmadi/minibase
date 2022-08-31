<script>
	import { goto } from '$app/navigation';

	import { showSuccess, showError } from '$lib/alerts';

	import { NewAppForm } from '$lib/components';

	function handleError({ detail }) {
		showError(detail.message);
	}

	function handleSuccess({ detail }) {
		showSuccess(detail.message);
		goto('/');
	}
</script>

<NewAppForm full on:success={handleSuccess} on:error={handleError} />
