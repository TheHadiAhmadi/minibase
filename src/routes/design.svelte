<script>
	import Alert from '$lib/components/Alert.svelte';
</script>

<h2>Minibase design</h2>

<Alert autoClose={false}>This is default Alert</Alert>

<Alert autoClose={false} variant="success">This is succss Alert</Alert>

<Alert autoClose={false} variant="error">This is error Alert</Alert>

<Alert autoClose={false} variant="warning">This is warning Alert</Alert>
