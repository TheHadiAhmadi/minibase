<script>
	import { goto } from '$app/navigation';

	import { session } from '$app/stores';
	import { Button } from '@ubeac/svelte-components';
	import { onMount } from 'svelte';

	onMount(() => {
		const sess = JSON.parse(localStorage.getItem('mb-session'));
		if (sess) $session = sess;
		if (sess) {
			goto('/apps');
		} else {
			// goto('/login');
		}
	});
</script>

<div class="w-full pt-16 opacity-80 text-8xl flex flex-col items-center justify-center">
	MiniBase
	<span class="text-xl pt-2">Minimal Database & Authentication provider</span>
</div>
