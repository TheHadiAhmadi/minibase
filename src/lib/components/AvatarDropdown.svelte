<script lang="ts">
	import type { User } from '$lib/services/auth';

	import { Avatar, Button, Dropdown, Icon, Menu, MenuItem, MenuTitle } from '@svind/svelte';

	export let user: User;
</script>

<Dropdown align="end">
	<Button circle slot="target">
		<Avatar size="sm" src="/avatar.png" />
	</Button>
	<Menu>
		<MenuTitle>{user.username}</MenuTitle>
		<MenuItem href="/profile">
			<Icon slot="start" icon="la:user" />
			Profile
		</MenuItem>
		<MenuItem href="/new">
			<Icon slot="start" icon="la:plus" />
			New App
		</MenuItem>
		<MenuItem href="/settings">
			<Icon slot="start" icon="la:cog" />
			Settings
		</MenuItem>
		<MenuItem href="/logout">
			<Icon slot="start" icon="la:sign-out-alt" />
			Logout
		</MenuItem>
	</Menu>
</Dropdown>
