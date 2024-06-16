<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let width: number;
	let height: number;
	let mouse = false;

	interface Dot {
		x: number;
		y: number;
		vx: number;
		vy: number;
	}

	let dots: Dot[] = [];

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		width = window.innerWidth;
		height = window.innerHeight;

		const resizeListener = () => {
			width = window.innerWidth;
			height = window.innerHeight;
		};

		const mousedownListener = () => {
			mouse = true;
		};

		const mouseupListener = () => {
			mouse = false;
		};

		const mouseleaveListener = () => {
			mouse = false;
		};

		const mousemoveListener = (event: MouseEvent) => {
			if (!mouse) return;
			if (frame % 8 != 0) return
			dots.push({
				x: event.x,
				y: event.y,
				vx: Math.random() - 0.5,
				vy: Math.random() - 0.5,
			});
		};

		window.addEventListener('resize', resizeListener);
		window.addEventListener('mousedown', mousedownListener);
		window.addEventListener('mouseup', mouseupListener);
		window.addEventListener('mouseleave', mouseleaveListener);
		window.addEventListener('mousemove', mousemoveListener);

		const intervalId = setInterval(update, 1000 / 60);

		return () => {
			window.removeEventListener('resize', resizeListener);
			window.removeEventListener('mousedown', mousedownListener);
			window.removeEventListener('mouseup', mouseupListener);
			window.removeEventListener('mouseleave', mouseleaveListener);
			window.removeEventListener('mousemove', mousemoveListener);
			clearInterval(intervalId);
		};
	});

	let frame = 0;
	function update() {
		frame += 1;
		while (dots.length < 40) {
			dots.push({
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				vx: Math.random() - 0.5,
				vy: Math.random() - 0.5,
			});
		}
		if (dots.length < (window.innerHeight * window.innerWidth) / 17000) {
			dots.push({
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				vx: Math.random() - 0.5,
				vy: Math.random() - 0.5,
			});
		}
		if (dots.length > (window.innerHeight * window.innerWidth) / 13000) {
			dots.shift();
		}
		dots.forEach((dot) => {
			dot.x += dot.vx * 1.6;
			dot.y += dot.vy * 1.6;
		});
		dots = dots.filter(
			(dot) =>
				dot.x > 0 - 100 &&
				dot.x < window.innerWidth + 100 &&
				dot.y > 0 - 100 &&
				dot.y < window.innerHeight + 100
		);

		ctx.fillStyle = '#00000070';
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		dots.forEach((dot) => {
			ctx.fillRect(dot.x, dot.y, 2, 2);
			dots.forEach((dot2) => {
				ctx.beginPath();
				ctx.moveTo(dot.x, dot.y);
				ctx.lineTo(dot2.x, dot2.y);
				let dist =
					Math.sqrt((dot2.x - dot.x) ** 2 + (dot2.y - dot.y) ** 2) +
					0.1;
				if (dist > 300) dist = 100000;
				ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min((20 / dist) ** 1.6, 0.1)})`;
				ctx.stroke();
			});
		});
	}
</script>

<canvas bind:this={canvas} id="canvas" {width} {height}></canvas>

<style>
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0.7;
		pointer-events: none;
	}
</style>
