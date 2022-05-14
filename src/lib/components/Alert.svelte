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
		success: 'text-green-600 dark:text-green-400',
		warning: 'text-orange-600 dark:text-orange-400'
	};

	$: classes = clsx('rounded shadow m-1 ', {
		'p-4': !minimal,
		'p-2': minimal,
		[`bg-base-200 ${variantColors[variant]}`]: !important && !!variant,
		[`bg-${variantColors[variant]}`]: important && !!variant
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
