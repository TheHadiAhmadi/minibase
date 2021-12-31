<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import user from '$lib/stores/user';

	onMount(async () => {
		await user.logout();
		goto('/');
	});
</script>
