<script>
	import '@ubeac/svelte-components/styles.css';
	import 'virtual:windi.css';
	import '../app.css';

	import { onMount } from 'svelte';

	import { session } from '$app/stores';
	import { DashboardLayout } from '$lib/layouts';
	import { AlertBox } from '$lib/components';

	onMount(() => {
		$session = JSON.parse(localStorage.getItem('mb-session'));
	});
</script>

<div class="h-screen overflow-hidden">
	<AlertBox />
	<DashboardLayout session={$session}>
		<slot />
	</DashboardLayout>
</div>
