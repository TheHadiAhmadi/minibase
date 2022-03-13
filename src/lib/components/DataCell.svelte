<script>
	import { Cell } from '@ubeac/svelte-components';

	export let value;
	export let type = 'string';
</script>

<Cell>
	{value}
</Cell>
