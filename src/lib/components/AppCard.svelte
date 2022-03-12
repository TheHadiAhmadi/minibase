<script>
	import { Card, CardTitle, CardBody, Icon, Link } from '@ubeac/svelte-components';

	let isPublic = false;
	export { isPublic as public };

	export let name;
	export let description;
</script>

<Link hover href="/apps/{name}">
	<Card shadow class="h-30 min-w-60">
		<CardBody>
			<CardTitle class="mx-0 pb-0 flex items-center gap-2">
				{#if !isPublic}
					<Icon class="text-lg" icon="fa-solid:lock" />
				{:else}
					<Icon class="text-lg" icon="fa-solid:database" />
				{/if}
				{name}
			</CardTitle>
			{description}
		</CardBody>
	</Card>
</Link>
