<script lang="ts">
	import { getContext } from 'svelte';

	let className;
	export { className as class };

	let head = getContext('table-head');
</script>

<svelte:element this={head ? 'th' : 'td'} class={className}>
	<slot />
</svelte:element>
