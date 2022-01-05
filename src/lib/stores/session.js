import supabase from '$lib/supabase';
import { writable } from 'svelte/store';

function createSessionStore() {
	let initial = null;

	// load from localStorage

	const { subscribe, set } = writable(initial);

	function login() {
		supabase.auth.signIn({
			provider: 'github'
		});
	}

	function logout() {
		console.log('calling logout');
		supabase.auth.signOut();
		set(null);
	}

	function load(session) {
		console.log("Load", session)
		if (session) {
			localStorage.setItem('supabase.auth.token', JSON.stringify(session));
			set(session);
		} else {
			set(null);
		}
	}

	return {
		subscribe,
		login,
		logout,
		load
	};
}

export default createSessionStore();
