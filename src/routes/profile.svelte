<script>
	import { session } from '$app/stores';
</script>

<div>Profile Page</div>

{JSON.stringify($session)}

{#if $session.user}
	<div>Your email is: {$session.user.email}</div>
{/if}
