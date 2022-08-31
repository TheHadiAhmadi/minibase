<script>
import { invalidate } from '$app/navigation';

import { onMount } from 'svelte';

	import LandingPage from '../LandingPage.svelte';

	export let data;

	$: console.log({data})
	onMount(() => invalidate())
</script>

{#if data.user}
	<slot />
{:else}
	<LandingPage />
{/if}
