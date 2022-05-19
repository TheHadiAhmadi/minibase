<script>
	import { Icon, Input } from '@svind/svelte';

	export let startIcon = undefined;
	export let endIcon = undefined;
	export let value;
</script>

<div class="relative">
	{#if startIcon}
		<div
			class="top-0 bottom-0 left-0 text-muted w-6 h-6 flex items-baseline justify-center absolute m-3"
		>
			<Icon class="w-full h-full" icon={startIcon} />
		</div>
	{/if}
	<Input {...$$restProps} bind:value />
	{#if endIcon}
		<div
			class="top-0 bottom-0 right-0 text-muted w-6 h-6 flex items-baseline justify-center absolute m-3"
		>
			<Icon class="w-full h-full" icon={endIcon} />
		</div>
	{/if}
</div>
