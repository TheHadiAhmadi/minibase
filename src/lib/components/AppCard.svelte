<script>
	import { Card, CardTitle, CardBody, Icon, Button } from '@svind/svelte';

	let isPublic = false;
	export { isPublic as public };

	export let name;
	export let description;
</script>

<a href="http://{name}.localhost:8000/">
	<!-- TODO: Card transition and hoverable + shadow -->
	<Card class="min-w-60 transition hover:bg-[#efefef] dark:hover:bg-[#404040]">
		<CardBody>
			<div class=" text-lg flex items-center gap-3">
				{#if !isPublic}
					<Icon icon="fa-solid:lock" />
				{:else}
					<Icon icon="fa-solid:database" />
				{/if}
				<CardTitle>
					{name}
				</CardTitle>
			</div>
			<div class="text-muted pt-2">
				{description}
			</div>
		</CardBody>
	</Card>
</a>
