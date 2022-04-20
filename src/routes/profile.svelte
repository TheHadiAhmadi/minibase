<script>
	import { session } from '$app/stores';
</script>

<div>Profile Page</div>
<div>Your email is: {$session.user.email}</div>
