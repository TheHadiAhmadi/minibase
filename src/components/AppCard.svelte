<script>
	import { Card, CardTitle, Link } from '@ubeac/svelte-components';

	export let name;
	export let description;
</script>

<Link hover href="/apps/{name}">
	<Card compact shadow bordered class="h-40 min-w-60">
		<CardTitle>
			{name}
		</CardTitle>
		{description}
	</Card>
</Link>
