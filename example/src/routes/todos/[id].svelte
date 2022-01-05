<script>
	import { params } from '$app/stores';

	$: id = $params.id;
</script>

<div>Todo #{id}</div>
