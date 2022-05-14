<script>
	import { alerts } from '$lib/stores';
import { Icon } from '@svind/svelte';
import Alert from './Alert.svelte';

	// $: {
		// $alerts;
		// setTimeout(() => ($alerts = []), 5000);
	// }
</script>

<div class="absolute bottom-2 z-50 right-2 left-2 md:left-auto md:w-1/2">
	{#each $alerts as alert, index}		
	<Alert on:close={() => $alerts = $alerts.filter((a, i) => i !== index)}>
		<Icon slot="start" icon="la:{alert.type}" />
		{alert.text}
	</Alert>
		<!-- <Alert class="!flex-row" variant={alert.type} open>
			{alert.text}
		</Alert> -->
	{/each}
</div>
