import type { ProjectInfo } from '$types'
import svelteMedia from 'svelte-media'
import { writable } from 'svelte/store'

export const media = svelteMedia({
    'sm': "(max-width: 640px)",
    'md': "(max-width: 768px)",
    'lg': "(max-width: 920px)",
})

export const activeProject = writable<ProjectInfo>()