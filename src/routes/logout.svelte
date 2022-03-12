<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';

	onMount(async () => {
		localStorage.removeItem('mb-session');
		$session = null;
		goto('/');
	});
</script>
