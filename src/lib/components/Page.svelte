<script>
	import { Card, CardFooter, CardBody, CardHeader } from '@svind/svelte';

	export let center = false;

	export let size = undefined;

	export let noPadding = false;

	export let title = undefined;
</script>

<div
	class="flex h-full flex-col"
	class:p-2={!noPadding}
	class:justify-center={center}
	class:items-center={center}
>
<div class={size ? `w-full max-w-${size}` : 'h-full'}>

	<Card>
		{#if title}
			<CardHeader>
				<div class="flex items-center justify-between">

					{title}
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
</div>

</div>
