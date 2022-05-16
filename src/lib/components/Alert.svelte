<script lang="ts">
	import { Button, Icon } from '@svind/svelte';
	import clsx from 'clsx';

	import { createEventDispatcher, onMount } from 'svelte';

	export let minimal = false;
	export let autoClose = true;
	export let open = true;
	export let important = false;
	export let variant: 'info' | 'success' | 'error' | 'warning' = 'info';
	export let duration = 5000;

	const dispatch = createEventDispatcher();
	function close() {
		open = false;
		dispatch('close');
	}

	onMount(() => {
		if (autoClose) {
			setTimeout(close, duration);
		}
	});

	let variantColors = {
		info: 'text-cyan-600 dark:text-cyan-400',
		error: 'text-red-600 dark:text-red-400',
		success: '',
		warning: 'text-orange-600 dark:text-orange-400'
	};

	$: classes = clsx('alert', {
		'alert-compact': minimal,
		[`alert-${variant}`]: !!variant
	});
</script>

{#if open}
	<div class={classes}>
		<div class="flex">
			<div>
				<slot name="start" />
			</div>

			<div class="flex-1">
				<slot />
			</div>
			<div>
				<slot name="end">
					<Button size="xs" on:click={close} circle>
						<Icon icon="la:times" />
					</Button>
				</slot>
			</div>
		</div>
	</div>
{/if}
<style lang="postcss" global>
	.alert {
		@apply rounded m-1 p-4;

		font-size: 14px;
		font-weight: 400;
	}

	.alert-compact {
		@apply p-2;
	}

	.alert-success {
		background-color: #dafbe1;
		border: 1px solid rgba(74,194,107,0.4);
		color: #24292f;
	}

	.dark .alert-success {
		color: #c9d1d2;
		background-color: rgba(46,160,67,0.15);
		border: 1px solid rgba(46,160,67,0.4);
	}
	.alert-warning {
		background-color: #fff8c5;
		border: 1px solid rgba(212,167,44,0.4);
		color: #24292f;
	}

	.dark .alert-warning {
		color: #c9d1d2;
		background-color: rgba(187,128,9,0.15);
		border: 1px solid rgba(187,128,9,0.4);
	}

	.alert-error {
		background-color: #ffebe9;
		border: 1px solid rgba(225,129,130,0.4);
		color: #24292f;
	}

	.dark .alert-error {
		color: #c9d1d2;
		background-color: rgba(248,81,73,0.15);
		border: 1px solid rgba(248,81,73,0.4);
	}

	.alert-info {
		background-color: #ddf4ff;
		border: 1px solid rgba(84,174,255,0.4);
		color: #24292f;
	}

	.dark .alert-info {
		color: #c9d1d2;
		background-color: rgba(56,139,253,0.15);
		border: 1px solid rgba(56,139,253,0.4);
	}

</style>