<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import supabase from '$lib/supabase';

	onMount(async () => {
		supabase.auth.signOut();
		goto('/');
	});
</script>
