<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { Item } from '$lib/types';
	import { initSimulation, duplicate_item } from './interactions';

	let items: Writable<Item[]> = writable([
		{
			name: 'rock',
			icon: '🪨',
			position: { x: 300, y: 250 },
			held: false,
			status: 'free',
			id: 1,
		},
		{
			name: 'fire',
			icon: '🔥',
			position: { x: 400, y: 500 },
			held: false,
			status: 'free',
			id: 2,
		},
		{
			name: 'water',
			icon: '🌊',
			position: { x: 400, y: 550 },
			held: false,
			status: 'free',
			id: 3,
		},
	]);

	initSimulation(items);
</script>

<main>
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
			on:mouseleave={() => (item.held = false)}
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
		transition: top left 100ms linear;
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
