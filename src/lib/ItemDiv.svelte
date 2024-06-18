<script lang="ts">
	import type { Item } from '$lib/types';
	export let item: Item;
</script>

<div
	style="
		top: {item.position.y}px;
		left: {item.position.x}px;
		outline-width: {item.held ? '1px' : '0'}
	"
	data-id={item.id}
>
	{#if item.status == 'merge'}
		<span>🔄</span> loading...
	{:else}
		<span>{item.emoji}</span>{item.word}
	{/if}
</div>

<style>
	div {
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
		transform: translate(-50%, -50%);
		outline-style: solid;
		outline-color: #1b9753;
		outline-width: 0;
		z-index: 0;
		width: fit-content;
	}
	span {
		font-size: 24px;
		transition: all 200ms ease-out;
	}
	div:hover span {
		font-size: 34px;
	}
</style>
