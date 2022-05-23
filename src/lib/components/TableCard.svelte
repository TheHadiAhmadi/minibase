<script>
	import { Button, ButtonList, Card, Icon, Row } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let app;
	export let table;
	export let access = false;
	$: console.log(table);
</script>

<Card hoverable class="mb-2 hover:bg-[#efefef] dark:hover:bg-[#404040]">
	<div class="flex items-center pr-4">
		<a sveltekit:prefetch class="p-4 flex items-baseline gap-2 flex-1" href="./{app}/{table.name}">
			<span class="text-lg mb-2 ">
				{table.name}
			</span>
			<div class="flex flex-col">
				<span class="text-muted font-light text-xs">
					{#if table.rows.length > 1}
						({table.rows.length}) columns
					{:else}
						( {table.rows.length}) column
					{/if}
				</span>
				<!-- <span class="text-muted text-xs">(... rows)</span> -->
			</div>
		</a>
		<div class="flex space-x-1">
			{#if access}
				<ButtonList>
					<Button on:click={() => dispatch('update')} size="xs" square variant="info">
						<Icon size="sm" icon="fa-solid:edit" />
					</Button>
					<Button on:click={() => dispatch('remove')} size="xs" square variant="error">
						<Icon size="sm" icon="fa-solid:trash-alt" />
					</Button>
				</ButtonList>
			{/if}
		</div>
	</div>
</Card>
