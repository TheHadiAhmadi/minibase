<script context="module">
	export async function load({ params, fetch, session, stuff }) {
		const todos = await fetch('/todos.json').then((res) => res.json());

		console.log('inside load');

		return {
			status: 200,
			props: {
				todos
			}
		};
	}
</script>

<script>
	import { invalidate } from '$app/navigation';

	import Todo from '$lib/Todo.svelte';

	export let todos = [];
	let newTodo = '';
	async function submit() {
		await fetch('/todos.json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: newTodo })
		}).then((res) => res.json());
		invalidate('/todos.json');
	}
</script>

<div>All Todos</div>
{#each todos as todo}
	<Todo {todo} />
{/each}

<form on:submit|preventDefault={submit}>
	<input bind:value={newTodo} />
	<button>Add</button>
</form>
