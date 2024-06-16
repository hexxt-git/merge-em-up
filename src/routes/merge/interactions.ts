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

function update(items: Item[]) {
	items.forEach((item: Item) => {
		if (item.held || item.status == 'delete') return;
		items.forEach((other) => {
			if (item.id == other.id || other.status == 'delete') return;
			const dif: Vector2 = vectorSubtract(item.position, other.position);
			const dir: Vector2 = vectorNormalize(dif);
			const dist: number = vectorMagnitude(dif);
			let force: number = 100 / (dist ** 1.2 + 20);
			if (other.held) force *= -0.3;
            else if (dist > 400) force = 0
			item.position = vectorAdd(
				item.position,
				vectorMultiply(dir, force)
			);
			if (
				dist < 20 &&
				item.name != other.name &&
				other.status != 'merge' &&
				item.status != 'merge' && 
                ! other.held
			) {
				item.status = 'delete';
				other.status = 'merge';
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
				item.position.x += e.movementX;
				item.position.y += e.movementY;
			});
			return items;
		});
	};

	if (typeof window != 'undefined') {
		window.addEventListener('mousemove', handle_mousemove);
	}
}

export function initSimulation(items: Writable<Item[]>) {
	mouse_interactions(items);
	update_loop(items);
}

export function duplicate_item(items: Writable<Item[]>, item: Item) {
    if(item.status != 'free') return;
	const newItem = JSON.parse(JSON.stringify(item)); // js is retarded
	newItem.id = Math.random();
	newItem.position.x += Math.random();
	newItem.position.y += Math.random();

	items.update((items) => [...items, newItem]);
}
