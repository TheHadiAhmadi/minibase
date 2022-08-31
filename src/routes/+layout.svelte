<script>
	import '@svind/svelte/styles.css';

	import 'virtual:windi.css';
	import '../app.css';

	import { AlertBox } from '$lib/components';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	export let data;

	// onMount(() => invalidate());
</script>

<AlertBox />

<slot />

