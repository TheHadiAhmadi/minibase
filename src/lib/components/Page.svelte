<script>
	import { Card, CardFooter, CardBody, CardHeader, CardTitle, Col } from '@svind/svelte';

	export let full = false;
	export let title = undefined;

	$: colOptions = full
		? { col: 12 }
		: {
				col: 12,
				sm: 8,
				md: 6,
				lg: 4
		  };
</script>

<Col {...colOptions}>
	<Card class="bg-base">
		{#if title || $$slots['actions']}
			<CardHeader>
				<div class="w-full flex items-center justify-between">
					<CardTitle>
						{title}
					</CardTitle>
					<div class="flex items-center justify-end">
						<slot name="actions" />
					</div>
				</div>
			</CardHeader>
		{/if}
		<slot>
			<CardBody>
				<slot name="body" />
			</CardBody>
		</slot>
		{#if $$slots['footer:actions']}
			<CardFooter position="end">
				<slot name="footer:actions" />
			</CardFooter>
		{/if}
	</Card>
</Col>
