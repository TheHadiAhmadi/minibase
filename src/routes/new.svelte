<script>
	import { goto } from '$app/navigation';

	import { showAlert } from '$lib/errors';

	import { NewAppForm } from '$lib/components';

	function handleError({ detail }) {
		showAlert(detail.message, 'error');
	}

	function handleSuccess({ detail }) {
		console.log('detail: ', detail);
		showAlert(detail.message, 'success');
		goto('/apps');
	}
</script>

<NewAppForm on:success={handleSuccess} on:error={handleError} />
