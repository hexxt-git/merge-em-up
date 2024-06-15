<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { Item } from '$lib/types';
	import { update_loop, duplicate_item } from './interactions';

	let items: Writable<Item[]> = writable([
		{
			name: 'rock',
			icon: '🪨',
			position: { x: 300, y: 250 },
			velocity: { x: 1, y: 1 },
			held: false,
			id: 1,
		},
		{
			name: 'fire',
			icon: '🔥',
			position: { x: 400, y: 500 },
			velocity: { x: 0, y: 0 },
			held: false,
			id: 2,
		},
		{
			name: 'water',
			icon: '🌊',
			position: { x: 500, y: 150 },
			velocity: { x: 0, y: 0 },
			held: false,
			id: 3,
		},
	]);

	update_loop(items);
</script>

<main>
	{#each $items as item (item.id)}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="item"
			style="
                top: {item.position.y}px;
                left: {item.position.x}px;
                outline: {item.held ? 'solid #1b9753 1px' : 'none'}
            "
			on:mousedown={() => (item.held = true)}
			on:mouseup={() => (item.held = false)}
			on:mouseleave={() => (item.held = false)}
			on:mouseout={() => (item.held = false)}
			on:blur={() => (item.held = false)}
			on:dblclick={() => duplicate_item(items, item)}
		>
			<span>{item.icon}</span>{item.name}
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
		background-color: #fffe;
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
	}
	.item span {
		font-size: 24px;
		transition: all 200ms ease-out;
	}
	.item:hover span {
		font-size: 34px;
	}
</style>
