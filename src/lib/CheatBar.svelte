<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { Item, Entry } from './types';
	import { insertItem } from '../routes/merge/interactions';
	export let items: Writable<Item[]> = writable([]);
	export let history: Writable<Entry[]> = writable([]);

	let processing = false;
	let textInput: HTMLInputElement;
	let form: HTMLFormElement;

	function handleKeydown(event: KeyboardEvent) {
		if (event.code === 'KeyK' && event.ctrlKey) {
			event.preventDefault();
			textInput.focus();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	const submit = async () => {
		if (processing) return;
		processing = true;
		let word = textInput.value;
		if (word.length == 0) {
			processing = false;
			return;
		};
		let emoji = '';
		let emoji_res = await fetch(`/api/emoji?word=${word}`);
		if (emoji_res.status == 200) emoji = await emoji_res.text();
		insertItem(items, history, word, emoji);
		if (textInput.value == word) textInput.value = '';
		processing = false;
	};
</script>

<form on:submit|preventDefault={submit} bind:this={form}>
	<input type="text" placeholder="add a new item" bind:this={textInput} />
	{#if textInput?.value?.length > 0}
		<button on:click={() => form.submit()}>Enter</button>
	{:else}
		<button on:click={() => textInput.focus()}>ctrl + k</button>
	{/if}
</form>

<style>
	form {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		margin: 20px auto;
		width: 400px;
		max-width: 60vw;
		border: solid 1px #555;
		border-radius: 100px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 15px;
		user-select: none;
		backdrop-filter: blur(3px);
	}
	form button {
		background-color: #f3f3f3;
		border-radius: 7px;
		padding: 3px 10px;
		cursor: pointer;
		user-select: none;
		font-family: sans-serif;
		color: #222;
		border: none;
	}
	@media (max-aspect-ratio: 3/4) {
		form button {
			display: none;
		}
	}
	input {
		border: none;
		background: transparent;
		padding: 10px 25px;
		font-size: 20px;
	}
	input:focus {
		outline: none;
	}
</style>
