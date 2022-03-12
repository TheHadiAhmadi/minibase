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

<div class="w-full h-full flex items-center justify-center">
	<Button on:click={() => goto('/login')}>Sign In</Button>
</div>
