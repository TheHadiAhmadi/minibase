<script>
	import { alerts } from '$lib/stores';

	import { Alert } from '@ubeac/svelte-components';

	$: {
		$alerts;
		setTimeout(() => ($alerts = []), 5000);
	}
</script>

<div class="absolute bottom-2 z-50 right-2 left-2 md:left-auto md:w-1/2">
	{#each $alerts as alert}
		<Alert class="!flex-row" variant={alert.type} open>
			{alert.text}
		</Alert>
	{/each}
</div>
