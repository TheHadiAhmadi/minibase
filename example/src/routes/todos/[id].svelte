<script>
	import { page } from '$app/stores';

	$: id = $page.params.id;
</script>

<div>Todo #{id}</div>
