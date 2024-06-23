<script lang="ts">
	import {
		initSimulation,
		mouseUp,
		mouseDown,
		mouseDBClick,
		insertItem,
	} from './interactions';
	import CheatBar from '$lib/CheatBar.svelte';
	import Help from '$lib/Help.svelte';
	import { onMount } from 'svelte';
	let show_help = false;
	let show_history = true;
	let container: HTMLElement;
	import ItemDiv from '$lib/ItemDiv.svelte';

	import { writable, type Writable } from 'svelte/store';
	import type { Entry, Item } from '$lib/types';

	const items: Writable<Item[]> = writable([]);
	const history: Writable<Entry[]> = writable([]);

	if (typeof window != 'undefined') {
		insertItem(items, history, 'water', '💧');
		insertItem(items, history, 'fire', '🔥');
		insertItem(items, history, 'earth', '🌍');
		insertItem(items, history, 'air', '💨');
	}

	onMount(() => {
		initSimulation(items, history, container);
	});
</script>

<main class={show_history ? 'game' : 'no-game'}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div
		bind:this={container}
		on:mousedown={(e) => mouseDown(items, e)}
		on:mouseup={(e) => mouseUp(items)}
		on:touchstart={(e) => mouseDown(items, e)}
		on:touchend={(e) => mouseUp(items)}
		on:mouseleave={(e) => mouseUp(items)}
		on:dblclick={(e) => mouseDBClick(items, e)}
		id="game"
	>
		<CheatBar {items} {history} />

		{#each $items as item (item.id)}
			<ItemDiv {item} />
		{/each}

		<div class="buttons">
			<button on:click={() => (show_help = !show_help)}>?</button>
			<button on:click={() => (show_history = !show_history)}>=</button>
		</div>
		<div class="overlays">
			{#if show_help}
				<Help />
			{/if}
		</div>
	</div>
	<dib id="history">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		{#each $history as entry}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span
				on:click={() =>
					insertItem(items, history, entry.word, entry.emoji)}
				>{entry.emoji} {entry.word}</span
			>
		{/each}
	</dib>
</main>

<style>
	main {
		display: grid;
		grid-template-columns: 3fr 2fr;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		transition:
			grid-template-columns 0.4s ease-out,
			grid;
	}
	.no-game {
		grid-template-columns: 3fr 0;
	}
	#history {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		gap: 10px;
		padding: 20px;
		backdrop-filter: blur(2px);
		overflow: hidden scroll;
		scrollbar-width: thin;
	}
	#history span {
		padding: 15px 20px;
		border: solid #888 1px;
		border-radius: 200px;
		user-select: none;
		cursor: pointer;
		font-size: 18px;
		font-weight: bold;
		letter-spacing: 1px;
		height: fit-content;
		box-shadow: #aaa1 0 0 10px;
		backdrop-filter: blur(4px);
	}
	#game {
		position: relative;
		overflow: hidden;
		border-right: solid 1px #222;
	}
	@media (max-width: 800px) {
		main {
			grid-template-columns: 1fr;
			grid-template-rows: 3fr 4fr;
			transition:
				grid-template-rows 0.4s ease-out,
				grid;
		}
		.no-game {
			grid-template-columns: 1fr;
			grid-template-rows: 3fr 0;
		}
		#game {
			border-right: 0;
			border-bottom: solid 1px #222;
		}
		#history {
			padding: 10px;
		}
		#history span {
			padding: 10px 15px;
			font-size: 16px;
			font-weight: normal;
		}
	}
	.buttons {
		position: absolute;
		bottom: 0;
		right: 0;
		padding: 20px;
		display: flex;
		gap: 10px;
		user-select: none;
	}
	.buttons button {
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fffe;
		border-radius: 100%;
		border: solid #222 1px;
		font-family: sans-serif;
		font-size: 20px;
		font-weight: 300;
		cursor: pointer;
	}
	.overlays {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
	}
</style>
