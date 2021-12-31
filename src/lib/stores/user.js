import supabase from '$lib/supabase'
import { writable } from 'svelte/store';
import {browser} from '$app/env'

function createUserStore() {
    let initial = null

    // load from localStorage
    
    const {subscribe, set} = writable(initial)
    load()
    
    function login() {
        supabase.auth.signIn({
            provider: 'github'
        })
    }

    function logout() {
        console.log("calling logout")
        supabase.auth.signOut();
        set(null)
    }


    function load() {
        if(browser) {
            const auth = JSON.parse(localStorage.getItem('supabase.auth.token'));
            const user = auth?.currentSession?.user ?? null;
            set(user)
        } else {   
            set(null)
        }
    }

    return {
        subscribe,
        login,
        logout,
        load
    }
}

export default createUserStore()

