<script>
	export let title;
	export let sidebarOpen;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="flex flex-col h-full">

	<div class="bg-primary shadow-lg font-semibold text-white py-4 px-4 w-full flex items-center justify-between">
	<button on:click={() => sidebarOpen = !sidebarOpen} class="btn btn-primary bg-blue-200 text-black">sidebar</button>
	<div>Center</div>
	<div>End</div>
</div>
<div class="h-full flex flex-row bg-blue-100 text-gray-900 dark:(bg-gray-900 text-blue-100)">
	{#if sidebarOpen}
	<div class="hidden md:flex flex-col bg-blue-200 text-gray-800 dark:(bg-gray-800 text-blue-200)">
		<slot name="sidebar" />
	</div>
	{/if}
	{#if sidebarOpen}
		<div class="md:hidden flex flex-col bg-blue-200 text-gray-800 dark:(bg-gray-800 text-blue-200)">
			<slot name="sidebar" />
		</div>
	{/if}
	<div class="flex-1 h-full p-4">
		<slot />
	</div>
</div>
</div>
<style>
	:global(html), :global(body) {
		height: 100%;
	}

	:global(#svelte) {
		height: 100%;
	}
</style>