<script>
	import { Button, ButtonList, Card, Icon } from '@svind/svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let app;
	export let table;
	export let access = false;
</script>

<Card hoverable class="hover:bg-[#efefef] dark:hover:bg-[#404040]">
	<div class="flex items-center pr-4">
		<a sveltekit:prefetch class="p-4 flex-1" href="./{app}/{table.name}">{table.name}</a>
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
