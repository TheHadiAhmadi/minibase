<script>
	import { Card, CardActions, CardBody, CardHeader } from '@ubeac/svelte-components';

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
	<Card shadow class={size ? `w-full max-w-${size}` : 'h-full'}>
		{#if title}
			<CardHeader class="flex items-center justify-between ">
				{title}
				<div class="flex items-center justify-end">
					<slot name="actions" />
				</div>
			</CardHeader>
		{/if}
		<slot>
			<CardBody>
				<slot name="body" />
			</CardBody>
		</slot>
		{#if $$slots['footer:actions']}
			<CardActions position="end">
				<slot name="footer:actions" />
			</CardActions>
		{/if}
	</Card>
</div>
