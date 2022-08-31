<script>
	import { Button, Icon } from '@svind/svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let dark = false;

	function onClick() {
		dark = !dark;
		dispatch('change', { dark });
	}

	$: icon = dark ? 'fa-solid:sun' : 'fa-solid:moon';
</script>

<Button circle size="sm" class="p-1.5" on:click={onClick}>
	<Icon {icon} />
</Button>
