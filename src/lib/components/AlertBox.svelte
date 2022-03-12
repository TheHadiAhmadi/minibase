<script>
	import { alert } from '$lib/stores';

	import { Alert } from '@ubeac/svelte-components';

	$: {
		$alert;

		setTimeout(() => ($alert = null), 5000);
	}
</script>

<div class="absolute bottom-2 z-50 right-2 left-2 md:left-auto md:w-1/2">
	{#if $alert}
		<Alert class="!flex-row" variant={$alert.variant} open>
			{$alert.text}
		</Alert>
	{/if}
</div>
