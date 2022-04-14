<script>
	import { alert } from '$lib';
	import Modal from '@svind/svelte/components/modal/Modal.svelte';
	import { Card } from '@svind/svelte';

	import { Alert } from '@ubeac/svelte-components';
</script>

<Modal open>
	<div
		class="card bg-light dark:bg-dark col-12 sm:col-8 md:col-6 lg:col-4"
		on:click|stopPropagation
	>
		<slot />
		{#if $alert}
			<Alert class="!flex-row" variant={$alert.variant} open>
				{$alert.text}
			</Alert>
		{/if}
	</div>
</Modal>
