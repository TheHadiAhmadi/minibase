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

<div
	class="h-full text-shadow-xl bg-gradient-to-tr from-gray-200 to-blue-100 opacity-80 text-6xl flex flex-col items-center justify-center"
>
	MiniBase
	<span class="text-sm pt-2">Minimal Database & Authentication provider</span>
</div>
