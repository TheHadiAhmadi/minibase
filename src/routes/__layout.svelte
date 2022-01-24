<!-- <script lang="ts" context="module">
import { useFetch } from "$lib/useFetch";

	export async function load({fetch}) {
		return {
			stuff: {
				apps: useFetch([], () => get('/').then((result: {data: any[]}) => result.data),
				tables: useFetch([], (app) => get(`/${app}`).then((result: {data: any[]}) => result.data),
				data: useFetch([], (app, data) => get(`/${app}/${data}`).then((result: {data: any[]}) => result.data),
			}
		}
	}
</script> -->
<script>
	import '@ubeac/svelte-components/styles.css';
	import 'virtual:windi.css';
	import '../app.css';

	import supabase from '$lib/supabase';
	import { onMount } from 'svelte';

	import {
		Avatar,
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Card,
		Divider,
		Dropdown,
		FormGroup,
		Icon,
		Input,
		Label,
		Menu,
		MenuItem,
		MenuTitle,
		Modal,
		ModalActions,
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

	let modalOpen = false;
	let email = '';

	onMount(() => {
		$session = supabase.auth.session();
		supabase.auth.onAuthStateChange((event, sess) => {
			$session = sess;
		});
	});

	function loginWithGithub() {
		modalOpen = false;
		supabase.auth.signIn({
			provider: 'github'
		});
	}

	async function loginWithEmail() {
		// modalOpen = false;
		// const result = await supabase.auth.signIn({
		// 	email: email
		// });
		// if (result.data) {
		// 	alert('Email sent! Please check your inbox');
		// }
	}

	function cancel() {
		modalOpen = false;
	}
</script>

<div class="h-screen overflow-hidden">
	<!-- {#if $session} -->
	<Layout title={$title} {sidebarColor} bind:sidebarMode {navbarMode} {navbarColor}>
		<Breadcrumb slot="navbar-start">
			<BreadcrumbItem href="/">
				<Icon name="fas-database" class="mr-2" />
				Minibase
			</BreadcrumbItem>
		</Breadcrumb>
		<svelte:fragment slot="navbar-end">
			{#if $session}
				<Dropdown end>
					<!-- <Icon slot="title" name="fas-bars" /> -->
					<Avatar
						size="sm"
						slot="title"
						class="shadow rounded-full hover:shadow-lg"
						image={$session?.user?.user_metadata?.avatar_url}
					/>
					<Menu class="border border-base-300 bg-base-100 text-base-content" rounded>
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
			{:else}
				<Button
					variant="neutral"
					on:click={() => {
						email = '';
						modalOpen = true;
					}}>Sign In</Button
				>
			{/if}
		</svelte:fragment>

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
	<!-- {:else} -->
	<!-- <div class="w-full h-screen grid place-content-center"> -->
	<!-- </div> -->
	<!-- {/if} -->
</div>

<Modal bind:open={modalOpen}>
	Sign In
	<div class="pt-4 flex flex-col gap-2">
		<!-- <FormGroup>
			<Label>Email</Label>
			<Input type="email" bind:value={email} />
		</FormGroup>
		<Button block on:click={loginWithEmail}>Sign In</Button>
		<Divider>Or</Divider> -->
		<Button block on:click={loginWithGithub}>Sign In With Github</Button>
		<Button block on:click={cancel} variant="ghost">Cancel</Button>
	</div>
</Modal>
