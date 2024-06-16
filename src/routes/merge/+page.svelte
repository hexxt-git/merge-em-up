<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { Item } from '$lib/types';
	import { initSimulation, duplicate_item } from './interactions';
	import { onMount } from 'svelte';

	let items: Writable<Item[]> = writable([]);
	if (typeof window != 'undefined') {
		items.set([
			{
				name: 'rock',
				icon: '🪨',
				position: {
					x: window.innerWidth / 2 + Math.random() * 600 - 300,
					y: window.innerHeight / 2 + Math.random() * 600 - 300,
				},
				held: false,
				status: 'free',
				id: Math.random(),
			},
			{
				name: 'fire',
				icon: '🔥',
				position: {
					x: window.innerWidth / 2 + Math.random() * 600 - 300,
					y: window.innerHeight / 2 + Math.random() * 600 - 300,
				},
				held: false,
				status: 'free',
				id: Math.random(),
			},
			{
				name: 'water',
				icon: '🌊',
				position: {
					x: window.innerWidth / 2 + Math.random() * 600 - 300,
					y: window.innerHeight / 2 + Math.random() * 600 - 300,
				},
				held: false,
				status: 'free',
				id: Math.random(),
			},
		]);
	}

	initSimulation(items);
	let processing = false;

	let textInput: HTMLInputElement;
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
</script>

<main>
	<form
		on:submit={async () => {
			if (processing) return;
			processing = true;
			let word = textInput.value;
			let emoji_res = await fetch(`/api/emoji?word=${word}`);
			let emoji_data = await emoji_res.json();
			let emoji = emoji_data.emoji;
			$items.push({
				name: word,
				icon: emoji,
				position: {
					x: window.innerWidth / 2 + Math.random() * 600 - 300,
					y: window.innerHeight / 2 + Math.random() * 600 - 300,
				},
				held: false,
				status: 'free',
				id: Math.random(),
			});
			if (textInput.value == word) textInput.value = '';
			processing = false;
		}}
	>
		<input type="text" placeholder="add a new item" bind:this={textInput} />
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		{#if textInput?.value?.length > 0}
			<span>Enter</span>
		{:else}
			<span on:click={() => textInput.focus()}>ctrl + k</span>
		{/if}
	</form>
	{#each $items as item (item.id)}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="item"
			style="
                top: {item.position.y}px;
                left: {item.position.x}px;
                outline-width: {item.held ? '1px' : '0'}
            "
			on:mousedown={() => (item.held = true)}
			on:mouseup={() => (item.held = false)}
			on:touchstart={() => (item.held = true)}
			on:touchend={() => (item.held = false)}
			on:dblclick={() => duplicate_item(items, item)}
			>
			{#if item.status == 'merge'}
				<span>🔄</span> loading...
			{:else}
				<span>{item.icon}</span>{item.name}
			{/if}
		</div>
	{/each}
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}
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
	}
	form span {
		background-color: #f3f3f3;
		border-radius: 7px;
		padding: 3px 10px;
		cursor: pointer;
		user-select: none;
		font-family: sans-serif;
		color: #222;
	}
	@media (max-aspect-ratio: 1/1){
		form span{
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
	.item {
		position: absolute;
		background-color: #fff9;
		color: #222;
		/* HACK for some reason bluring the backdrop makes the whole element mushy */
		/* backdrop-filter: blur(3px); */
		padding: 15px 40px 15px 30px;
		border: solid #888 1px;
		border-radius: 200px;
		user-select: none;
		cursor: grab;
		font-size: 18px;
		font-weight: bolder;
		letter-spacing: 1px;
		display: flex;
		gap: 15px;
		align-items: center;
		transform: translate(-50%, -50%) translateZ(0);
		outline-style: solid;
		outline-color: #1b9753;
		outline-width: 0;
	}
	.item span {
		font-size: 24px;
		transition: all 200ms ease-out;
	}
	.item:hover span {
		font-size: 34px;
	}
</style>
