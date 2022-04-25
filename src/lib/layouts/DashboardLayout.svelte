<script>
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

	let dark = false
	function toggleTheme() {
		dark = !dark;
	}
</script>

<Modal bind:open={loginOpen}>
	<LoginForm on:login={login} on:error={handleError} />
</Modal>

<Modal bind:open={signupOpen}>
	<SignupForm on:signup={signup} on:error={handleError} />
</Modal>

<Page {dark}>
	<Header>
		<div class="navbar-brand items-center flex gap-3">
			<Icon icon="fa:database" class="mr-2 text-2xl" />
			<!-- Minibase -->
			TODO
		</div>

		<div class="flex items-center">

			<Button circle size="sm" on:click={toggleTheme}>
				{#if dark}
				<Icon icon="fa-solid:sun" />
				{:else}
				<Icon icon="fa-solid:moon" />
				{/if}

			</Button>
			
			{#if $session}
			<Dropdown align="end">
				<Avatar slot="target" size="sm" src="/avatar.png" />
				<div class="bg-gray-200 dark:bg-gray-800">
					<Menu>
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
				</div>
			</Dropdown>
		{:else}
			<ButtonList>
				<Button on:click={openLogin}>Log In</Button>
				<Button on:click={openSignup} variant="primary">Sign Up</Button>
			</ButtonList>
		{/if}
	</div>
	</Header>
	<PageWrapper>
		<PageBody>
			<slot />
		</PageBody>
	</PageWrapper>
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
