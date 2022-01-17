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
	import { default as Layout } from '@ubeac/svelte-components/layouts/Dashboard.svelte';
	import { navigating } from '$app/stores';
	import { session } from '$app/stores';
	import sidebar from '$lib/sidebar';
	import title from '$lib/title';

	let sidebarMode = 'open'; // open | close | mini
	let navbarMode = 'wide'; // wide | tight
	let navbarColor = 'neutral'; // base | neutral | primary
	let sidebarColor = 'base'; // base | neutral | primary

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

<div class="h-screen overflow-hidden">
	{#if $session}
		<Layout title={$title} {sidebarColor} bind:sidebarMode {navbarMode} {navbarColor}>
			<Breadcrumb slot="navbar-start">
				<BreadcrumbItem href="/">
					<Icon name="fas-database" class="mr-2" />
					Minibase
				</BreadcrumbItem>
			</Breadcrumb>
			<Dropdown slot="navbar-end" end>
				<!-- <Icon slot="title" name="fas-bars" /> -->
				<Avatar
					size="sm"
					slot="title"
					class="shadow rounded-full hover:shadow-lg"
					image={$session?.user?.user_metadata?.avatar_url}
				/>
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
			<!-- <div class="w-full mx-auto p-2 container"> -->
			{#if $navigating}
				<div class="w-full h-full -mt-24 flex items-center justify-center">
					<Spinner size="sm" />
				</div>
			{:else}
				<div class="p-2">
					<slot />
				</div>
			{/if}
			<!-- </div> -->

			<Menu slot="sidebar">
				<MenuTitle>{$sidebar.title}</MenuTitle>
				{#each $sidebar.items as item}
					<MenuItem iconOnly={sidebarMode === 'mini'} href={item.href}>
						<Icon name="fas-database" slot="prefix" />
						{item.name}
					</MenuItem>
				{/each}
			</Menu>

			<!-- 				
				<MenuItem href="/apps">Home</MenuItem>
				<MenuTitle>apps</MenuTitle>
				{#each apps as app}
					<MenuItem iconOnly={sidebarMode === 'mini'} href="/apps/{app.name}">
						<Icon name="fas-user" slot="prefix" />
						{app.name}
					</MenuItem>
				{/each} -->
		</Layout>
	{:else}
		<div class="w-full h-screen grid place-content-center">
			<button on:click={login} class="btn"> Login With Github </button>
		</div>
	{/if}
</div>
