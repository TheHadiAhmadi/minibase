<script>
	import { alerts } from '$lib';
	import { Modal } from '@svind/svelte';

</script>

<Modal static open>
	<div
		class="card bg-light dark:bg-dark col-12 sm:col-8 md:col-6 lg:col-4"
		on:click|stopPropagation
	>
		<slot />
		{#each $alerts as alert}
		TODO
			<!-- <Alert class="!flex-row" variant={alert.type} open>
				{alert.text}
			</Alert> -->
		{/each}
	</div>
</Modal>
