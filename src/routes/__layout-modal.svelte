<script>
	import { alerts } from '$lib/stores';
	import { Modal } from '@svind/svelte';

	import '@svind/css/dist/index.css';

import 'virtual:windi.css';
import '../app.css';
import '../modalLayout.css';

import '../app.d.ts';
import Alert from '$lib/components/Alert.svelte';
import { AlertBox } from '$lib/components';
</script>

<Modal static open>
	<div class="card col-12 sm:col-8 md:col-6 lg:col-4" on:click|stopPropagation>
		<slot />
		<!-- <AlertBox/> -->
		{#each $alerts as alert}
			<Alert minimal class="!flex-row" variant={alert.type} open>
				{alert.text}
			</Alert>
		{/each}
	</div>
</Modal>
