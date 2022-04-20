<script>
	import { Card, CardTitle, CardBody, Icon, Button } from '@svind/svelte';

	let isPublic = false;
	export { isPublic as public };

	export let name;
	export let description;
</script>

<a class="hover:bg-gray-100" href="/{name}">
	<Card class="min-w-60">
		<CardBody>
			<div class="mx-0 pb-0 flex items-center gap-2">
				{#if !isPublic}
					<Icon icon="fa-solid:lock" />
				{:else}
					<Icon icon="fa-solid:database" />
				{/if}
				<CardTitle>
					{name}
				</CardTitle>
			</div>
			{description}
		</CardBody>
	</Card>
</a>
