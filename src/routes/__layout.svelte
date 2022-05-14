<script context="module">
	/** @type {import('./').Load} */
	export async function load({ session }) {
		// console.log("__LAYOUT LOAD: ", {session})
		return {
			props: {
				user: session?.user ?? null
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

	export let user;

</script>

<AlertBox />
<DashboardLayout {user}>
	<slot name="sidebar" slot="sidebar"/>
	<slot />
</DashboardLayout>
