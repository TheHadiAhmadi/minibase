<script>
	import SignupForm from '$lib/components/SignupForm.svelte';
	import { session } from '$app/stores';
	import {
		Button,
		ButtonList,
		Header,
		NavBrand,
		Nav,
		PageWrapper,
		Page,
		PageBody,
		Avatar,
		Modal
	} from '@svind/svelte';

	import { showError } from '$lib/alerts';
	import { LoginForm } from '$lib/components';

	let signupOpen = false;
	let loginOpen = false;

	export function updateSession(sess) {
		localStorage.setItem('mb-session', JSON.stringify(sess));
		$session = sess;
	}

	function handleError({ detail }) {
		showError(detail.message);
	}

	function signup({ detail }) {
		updateSession(detail);
		signupOpen = false;
	}
	function login({ detail }) {
		updateSession(detail);
		loginOpen = false;
	}

	function openLogin() {
		loginOpen = true;
	}

	function openSignup() {
		signupOpen = true;
	}
</script>

<Modal bind:open={loginOpen}>
	<LoginForm on:login={login} on:error={handleError} />
</Modal>

<Modal bind:open={signupOpen}>
	<SignupForm on:signup={signup} on:error={handleError} />
</Modal>

<Page dark>
	<Header color="light">
		<NavBrand>Minibase</NavBrand>
		<Avatar>HA</Avatar>
		<Nav>
			{#if $session}
				<!-- <Dropdown end>
				<Icon slot="title" name="la:bars" />
				<Avatar size="sm" slot="title" class="shadow rounded-full hover:shadow-lg" src="/avatar.png" />
				<Menu compact class="border border-base-300 bg-base-100 text-base-content" rounded>
								<MenuTitle>{session.user?.username}</MenuTitle>
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
				</Dropdown> -->
			{:else}
				<ButtonList>
					<Button on:click={openLogin}>Log In</Button>
					<Button on:click={openSignup} variant="primary">Sign Up</Button>
				</ButtonList>
			{/if}
		</Nav>
	</Header>
	<PageWrapper>
		<PageBody>
			<slot />
		</PageBody>
	</PageWrapper>
</Page>

<!-- <script>
	import { createEventDispatcher, onMount } from 'svelte';

	import {
		Breadcrumb,
		BreadcrumbItem,
		Dropdown,
		Menu,
		MenuItem,
		MenuTitle,
		Spinner
	} from '@ubeac/svelte-components';
	import { Avatar, Button, Icon } from '@svind/svelte';

	import { default as Layout } from '@ubeac/svelte-components/layouts/Dashboard.svelte';
	import { navigating } from '$app/stores';
	import { title } from '$lib/stores';
	import { goto } from '$app/navigation';

	export let session;

	let sidebarMode = 'open'; // open | close | mini
	let navbarMode = 'wide'; // wide | tight
	let navbarColor = 'neutral'; // base | neutral | primary
	let sidebarColor = 'base'; // base | neutral | primary
</script>

<div class="h-screen overflow-hidden">
	<Layout
		themeButton={false}
		title={$title}
		{sidebarColor}
		{sidebarMode}
		{navbarMode}
		{navbarColor}
	>
	<Breadcrumb slot="navbar-start">
			<BreadcrumbItem href="/">
				<Icon icon="fa:database" class="mr-2 text-2xl" />
				Minibase
			</BreadcrumbItem>
		</Breadcrumb>
	<svelte:fragment slot="navbar-end">
	{#if session}
		
	{:else}
		<Button
			size="sm"
			variant="neutral"
			on:click={() => {
				goto('/login');
			}}
		>
			Log In
		</Button>
		<Button
			size="sm"
			variant="primary"
			on:click={() => {
				goto('/signup');
			}}
		>
			Sign Up
		</Button>
	{/if}
	</svelte:fragment>

	<div class="w-full mx-auto p-2 container">
	{#if $navigating}
		<div class="w-full h-full -mt-24 flex items-center justify-center">
			<Spinner size="sm" />
		</div>
	{:else}
		<slot />
	{/if}
	</div>

	<slot name="sidebar" slot="sidebar" />
	</Layout>
</div> -->
