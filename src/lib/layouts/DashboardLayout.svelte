<script lang="ts">
	import {
		Button,
		ButtonList,
		Header,
		NavBrand,
		PageWrapper,
		Page,
		PageBody,
		Modal,
		Icon
	} from '@svind/svelte';

	import { showError } from '$lib/alerts';
	import { SignupLoginForm } from '$lib/components';
	import { invalidate } from '$app/navigation';
	import AvatarDropdown from '$lib/components/AvatarDropdown.svelte';
	import ThemeButton from '$lib/components/ThemeButton.svelte';

	let modalOpen = false;
	let modalMode: 'signup' | 'login' = 'signup';

	export let user = null;
	export let dark = false;

	function handleError({ detail }) {
		showError(detail.message);
	}

	function signup({ detail }) {
		invalidate('/');
		modalOpen = false;
	}
	function login({ detail }) {
		invalidate('/');
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

	function themeChanged({ detail }) {
		console.log(detail);
		if (detail.dark) {
			console.log('switched to dark mode');
		}
		document.cookie = `dark=${detail.dark}`;
	}
</script>

<Modal bind:open={modalOpen}>
	<SignupLoginForm mode={modalMode} on:login={login} on:signup={signup} on:error={handleError} />
</Modal>

<slot name="sidebar" />
<Page {dark}>
	<Header>
		<div class="navbar-brand items-center flex gap-3">
			<Icon icon="fa:database" />
			Minibase
			<!-- TODO -->
		</div>

		{#if user}
			<div class="flex items-center gap-3">
				<ThemeButton on:change={themeChanged} bind:dark />
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
