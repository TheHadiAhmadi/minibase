<script>
	import { alert } from '$lib';

	import { Alert } from '@ubeac/svelte-components';
</script>

<div class="modal modal-open">
	<div class="modal-box rounded-box p-0">
		<slot />
		{#if $alert}
			<Alert class="!flex-row" variant={$alert.variant} open>
				{$alert.text}
			</Alert>
		{/if}
	</div>
</div>
