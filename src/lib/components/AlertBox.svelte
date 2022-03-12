<script>
	import { alert } from '$lib/stores';

	import { Alert, Button, Icon } from '@ubeac/svelte-components';

	function close() {
		$alert = null;
	}
</script>

<div class="absolute bottom-2 right-2 w-1/2">
	{#if $alert}
		<Alert variant={$alert.variant} bind:open={$alert.open}>
			{$alert.text}
			<Button slot="action" variant={$alert.variant} on:click={close} size="sm" circle>
				<Icon icon="fa-solid:times" />
			</Button>
		</Alert>
	{/if}
</div>
