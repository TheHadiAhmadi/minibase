<script>
	import '@ubeac/svelte-components/styles.css';
	import 'virtual:windi.css';
	import '../app.css';

	import { onMount } from 'svelte';

	import { session } from '$app/stores';
	import { Dashboard } from '../layouts';
	import { AlertBox } from '$lib/components';

	onMount(() => {
		$session = JSON.parse(localStorage.getItem('mb-session'));
	});
</script>

<AlertBox />

<div class="h-screen overflow-hidden">
	<Dashboard session={$session}>
		<slot />
	</Dashboard>
</div>
