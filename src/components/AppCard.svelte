<script>
	import { Card, CardTitle, Icon, Link } from '@ubeac/svelte-components';

	let isPublic = false;
	export { isPublic as public };

	export let name;
	export let description;
</script>

<Link hover href="/{name}">
	<Card compact class="h-30 min-w-60">
		<CardTitle class="mx-0 pb-0 flex items-center gap-2">
			{#if !isPublic}
				<Icon size="sm" name="fas-lock" />
			{:else}
				<Icon size="sm" name="fas-database" />
			{/if}
			{name}
		</CardTitle>
		{description}
	</Card>
</Link>
