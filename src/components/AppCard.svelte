<script>
	import { Card, CardTitle } from '@ubeac/svelte-components';

	export let name;
	export let description;
</script>

<Card compact shadow bordered class="h-40 bg-base-100">
	<CardTitle>
		<a sveltekit:prefetch href="/apps/{name}">{name}</a>
	</CardTitle>
	{description}
</Card>
