<script lang="ts">
	import SignupForm from '$lib/components/SignupForm.svelte';
	import { session } from '$app/stores';
	import {
		Button,
		ButtonList,
		Dropdown,
		Header,
		Menu,
		MenuItem,
		MenuTitle,
		NavBrand,
		PageWrapper,
		Page,
		PageBody,
		Avatar,
		Modal,
		Icon
	} from '@svind/svelte';

	import { showError } from '$lib/alerts';
	import { LoginForm } from '$lib/components';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import AvatarDropdown from '$lib/components/AvatarDropdown.svelte';
	import ThemeButton from '$lib/components/ThemeButton.svelte';

	let modalOpen = false;
	let modalMode: 'signup' | 'login' = 'signup';

	export let user = null;
	export let token = '';

	function handleError({ detail }) {
		showError(detail.message);
	}

	function signup({ detail }) {
		invalidate('/');
		modalOpen = false;
	}
	function login({ detail }) {
		modalOpen = false;
	}

	function openLogin() {
		modalMode = 'login';
		modalOpen = true;
	}

	function openSignup() {
		modalMode = 'signup';
		modalOpen = true;
	}

	let dark = false;
	function toggleTheme() {
		dark = !dark;
	}
</script>

<Modal bind:open={modalOpen}>
	{#if modalMode === 'login'}
		<LoginForm on:login={login} on:change={() => (modalMode = 'signup')} on:error={handleError} />
	{:else}
		<SignupForm on:signup={signup} on:change={() => (modalMode = 'login')} on:error={handleError} />
	{/if}
</Modal>

<Page {dark}>
	<Header>
		<div class="navbar-brand items-center flex gap-3">
			<Icon icon="fa:database" class="mr-2 text-2xl" />
			Minibase
			<!-- TODO -->
		</div>

		{#if user}
			<div class="flex gap-2">
				<ThemeButton bind:dark />
				<AvatarDropdown {user} />
			</div>
		{:else}
			<ButtonList>
				<Button on:click={openLogin}>Log In</Button>
				<Button on:click={openSignup} variant="primary">Sign Up</Button>
			</ButtonList>
		{/if}
	</Header>
	<div class="bg-base	h-full">
		<PageWrapper>
			<PageBody>
				<slot />
			</PageBody>
		</PageWrapper>
	</div>
</Page>

<!-- 
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
