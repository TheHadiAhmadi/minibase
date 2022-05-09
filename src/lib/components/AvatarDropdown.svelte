<script lang="ts">
	import type { User } from '$lib/services/auth';

	import { Avatar, Dropdown, Icon, Menu, MenuItem, MenuTitle } from '@svind/svelte';

	export let user: User;
</script>

<Dropdown align="end">
	<Avatar slot="target" size="sm" src="/avatar.png" />
	<Menu>
		<MenuTitle>{user.username}</MenuTitle>
		<MenuItem href="/profile">
			<Icon slot="prefix" icon="la:user" />
			Profile
		</MenuItem>
		<MenuItem href="/new">
			<Icon slot="prefix" class="text-xl" icon="la:plus" />
			New App
		</MenuItem>
		<MenuItem href="/settings">
			<Icon slot="prefix" class="text-xl" icon="la:cog" />
			Settings
		</MenuItem>
		<MenuItem href="/logout">
			<Icon slot="prefix" class="text-xl" icon="la:sign-out-alt" />
			Logout
		</MenuItem>
	</Menu>
</Dropdown>
