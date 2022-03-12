import { writable } from 'svelte/store';

export const alert = writable();
export const title = writable('minibase');
export const sidebar = writable({ title: '', items: [] });
