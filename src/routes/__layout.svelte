<script context="module">
	/** @type {import('./').Load} */
	export async function load({ session }) {
		return {
			props: {
				user: session?.user ?? null,
				dark: session?.dark ?? false
			}
		};
	}
</script>

<script>
	import '@svind/css/dist/index.css';

	import 'virtual:windi.css';
	import '../app.css';
	import '../app.d.ts';

	import { DashboardLayout } from '$lib/layouts';
	import { AlertBox } from '$lib/components';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	export let user;
	export let dark;

	onMount(() => invalidate());
</script>

<AlertBox />
<DashboardLayout {user} {dark}>
	<slot name="sidebar" slot="sidebar" />
	<slot />
</DashboardLayout>
