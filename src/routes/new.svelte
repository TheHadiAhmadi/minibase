<script>
	import { goto } from '$app/navigation';

	import { showSuccess, showError } from '$lib/alerts';

	import { NewAppForm } from '$lib/components';
	import { Modal } from '@svind/svelte';

	function handleError({ detail }) {
		showError(detail.message);
	}

	function handleSuccess({ detail }) {
		console.log('detail: ', detail);
		showSuccess(detail.message);
		goto('/');
	}
</script>

<Modal static open>
	<NewAppForm on:success={handleSuccess} on:error={handleError} />
</Modal>
