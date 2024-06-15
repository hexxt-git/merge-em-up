export interface Vector2 {
	x: number;
	y: number;
}

export function vectorAdd(v1: Vector2, v2: Vector2){
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y
	}
}
export function vectorMultiply(v: Vector2, k: number){
	return {
		x: v.x * k,
		y: v.y * k
	}
}

export interface Item {
	name: string;
	icon: string;
	position: Vector2;
	velocity: Vector2;
	held: boolean;
	id: number;
}
