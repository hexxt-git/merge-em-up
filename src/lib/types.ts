export interface Vector2 {
	x: number;
	y: number;
}

export function vectorAdd(v1: Vector2, v2: Vector2) {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y,
	};
}
export function vectorSubtract(v1: Vector2, v2: Vector2) {
	return {
		x: v1.x - v2.x,
		y: v1.y - v2.y,
	};
}
export function vectorMultiply(v: Vector2, k: number) {
	return {
		x: v.x * k,
		y: v.y * k,
	};
}
export function vectorMagnitude(v: Vector2) {
	return Math.sqrt(v.x * v.x + v.y * v.y);
}
export function vectorNormalize(v: Vector2) {
	const magnitude = vectorMagnitude(v);
	return {
		x: v.x / magnitude,
		y: v.y / magnitude,
	};
}

export interface Item {
	name: string;
	icon: string;
	position: Vector2;
	id: number;
	held: boolean;
	status: 'free'|'merge'|'delete';
}
