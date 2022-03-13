<script>
	export let message = 'Internal Server Error';
	export let status = 500;
</script>

<div class="w-full pt-32 flex flex-col gap-4 items-center justify-center text-center text-4xl">
	<span class="text-6xl font-bold">{status}</span>
	{message}
</div>
