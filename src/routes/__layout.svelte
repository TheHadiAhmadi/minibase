<script>
	import '@ubeac/svelte-components/styles.css';
	import 'virtual:windi.css';

	import supabase from '$lib/supabase';
	import { onMount } from 'svelte';

	import {
		Avatar,
		Breadcrumb,
		BreadcrumbItem,
		Card,
		Dropdown,
		Icon,
		Menu,
		MenuItem,
		MenuTitle,
		Spinner
	} from '@ubeac/svelte-components';
	import { navigating } from '$app/stores';
	import { session, page } from '$app/stores';

	onMount(() => {
		$session = supabase.auth.session();
		supabase.auth.onAuthStateChange((event, sess) => {
			$session = sess;
		});
	});

	function login() {
		supabase.auth.signIn({
			provider: 'github'
		});
	}
</script>

<div class="bg-gradient-to-tr from-blue-200 to-green-100 min-h-screen">
	{#if $session}
		<div class="p-2 px-4 text-black w-full flex items-center justify-between">
			<Breadcrumb>
				<BreadcrumbItem href="/">
					<Icon name="fas-database" class="m-2" />
					Minibase
				</BreadcrumbItem>

				<!-- <BreadcrumbItem href="/apps/${$app.id}">
					{$app.name}
				</BreadcrumbItem> -->
				<!-- {/if} -->
			</Breadcrumb>
			<Dropdown end>
				<Icon slot="title" name="fas-bars" />
				<!-- <Avatar
					size="sm"
					slot="title"
					class="shadow rounded-full hover:shadow-lg"
					image={$session.user_metadata.avatar_url}
				/> -->
				<Menu rounded>
					<MenuTitle>{$session?.user?.user_metadata?.user_name}</MenuTitle>
					<MenuItem href="/profile">
						<Icon slot="prefix" name="fas-user" />
						Profile
					</MenuItem>
					<MenuItem href="/new">
						<Icon slot="prefix" name="fas-plus" />
						New App
					</MenuItem>
					<MenuItem href="/settings">
						<Icon slot="prefix" name="fas-cog" />
						Settings
					</MenuItem>
					<MenuItem href="/logout">
						<Icon slot="prefix" name="fas-sign-out-alt" />
						Logout
					</MenuItem>
				</Menu>
			</Dropdown>
		</div>
		<div class="w-full mx-auto p-2 container">
			{#if $navigating}
				<div class="w-full h-screen -mt-24 flex items-center justify-center">
					<Spinner size="sm" />
				</div>
			{:else}
				<Card class="bg-base-200 bg-opacity-80">
					<slot />
				</Card>
			{/if}
		</div>
	{:else}
		<div class="w-full h-screen grid place-content-center">
			<button on:click={login} class="btn"> Login With Github </button>
		</div>
	{/if}
</div>
