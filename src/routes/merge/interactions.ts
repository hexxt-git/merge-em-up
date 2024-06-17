import {
	vectorAdd,
	vectorSubtract,
	vectorMultiply,
	vectorMagnitude,
	vectorNormalize,
	type Item,
	type Vector2,
} from '$lib/types';
import type { Writable } from 'svelte/store';

const merge_queue: Map<number, { emoji: string; word: string }> = new Map();

async function merge(word1: string, word2: string, id: number) {
	const res = await fetch(`/api/merge?word1=${word1}&word2=${word2}`);
	const data: { word: string; emoji: string } = await res.json();
	merge_queue.set(id, data);
}

function update(items: Item[]) {
	items.forEach((item) => {
		if (merge_queue.has(item.id)) {
			const mergeItem = merge_queue.get(item.id)!;
			item.status = 'free';
			item.word = mergeItem.word;
			item.emoji = mergeItem.emoji;
			merge_queue.delete(item.id);
		}
	});

	items.forEach((item: Item) => {
		item.position.x = Math.max(
			60,
			Math.min(item.position.x, window.innerWidth - 60)
		);
		item.position.y = Math.max(
			20,
			Math.min(item.position.y, window.innerHeight - 20)
		);
		if (item.held || item.status == 'delete') return;
		items.forEach((other) => {
			if (item.id == other.id || other.status == 'delete') return;
			const dif: Vector2 = vectorSubtract(item.position, other.position);
			const dir: Vector2 = vectorNormalize(dif);
			const dist: number = vectorMagnitude(dif);
			let force: number = 100 / (dist ** 1.2 + 20);
			if (other.held) {
				force = -150 / (dist + 70);
			} else if (dist > 400) force = 0;
			item.position = vectorAdd(
				item.position,
				vectorMultiply(dir, force)
			);
			if (
				dist < 20 &&
				// HACK so it doesnt merge when duplicating
				item.word != other.word &&
				other.status != 'merge' &&
				item.status != 'merge' &&
				!other.held
			) {
				item.status = 'delete';
				other.status = 'merge';
				merge(item.word, other.word, other.id);
			}
		});
	});
	items.sort((a, b) => Number(a.held) - Number(b.held));
	items = items.filter((item) => item.status !== 'delete');

	return items;
}

function update_loop(items: Writable<Item[]>) {
	setInterval(() => {
		items.update(update);
	}, 1000 / 60);
}

function mouse_interactions(items: Writable<Item[]>) {
	const handle_mousemove = (e: MouseEvent) => {
		items.update((items) => {
			items.forEach((item) => {
				if (!item.held) return;
				item.position.x = e.clientX;
				item.position.y = e.clientY;
			});
			return items;
		});
	};
	if (typeof window != 'undefined') {
		window.addEventListener('mousemove', handle_mousemove);
	}

	const handle_touchmove = (e: TouchEvent) => {
		items.update((items) => {
			items.forEach((item) => {
				if (!item.held) return;
				let touch = e.changedTouches[0];
				item.position.x = touch.clientX;
				item.position.y = touch.clientY;
			});
			return items;
		});
	};

	if (typeof window != 'undefined') {
		window.addEventListener('touchmove', handle_touchmove);
	}
}

export function initSimulation(items: Writable<Item[]>) {
	if (typeof window == 'undefined') return;
	mouse_interactions(items);
	update_loop(items);
}

export function duplicate_item(items: Writable<Item[]>, item: Item) {
	if (item.status != 'free') return;
	const newItem = JSON.parse(JSON.stringify(item));
	newItem.id = Math.random();
	newItem.position.x += Math.random();
	newItem.position.y += Math.random();

	items.update((items) => [...items, newItem]);
}
