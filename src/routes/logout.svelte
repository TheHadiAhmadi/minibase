<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import user from '$lib/stores/session';

	onMount(async () => {
		await user.logout();
		goto('/');
	});
</script>
