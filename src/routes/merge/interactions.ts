import { vectorAdd, vectorMultiply, type Item } from '$lib/types';
import type { Writable } from 'svelte/store';

const handle_mousemove = (e: MouseEvent) => {

};

if (typeof window != 'undefined') {
	window.addEventListener('mousemove',  handle_mousemove);
}

function update(items: Item[]) {
	items.forEach((item: Item) => {
		item.position = vectorAdd(item.position, item.velocity)
        item.velocity = vectorMultiply(item.velocity, 0.985)
	});
	items.sort((a, b) => Number(a.held) - Number(b.held));

	return items;
}

export function update_loop(items: Writable<Item[]>) {
	setInterval(() => {
		items.update(update);
	}, 1000 / 60);
}

export function duplicate_item(items: Writable<Item[]>, item: Item){   
    const newItem = JSON.parse(JSON.stringify(item)) // js is retarded
    newItem.id = Math.random()

    newItem.velocity = vectorMultiply(newItem.velocity, -2)
    item.velocity =  vectorMultiply(item.velocity, 2)
    
    items.update(items => [...items, newItem])
}