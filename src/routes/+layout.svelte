<script>
	import Background from '$lib/Background.svelte';
	import Help from '$lib/Help.svelte';
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
<link
	href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
	rel="stylesheet"
/>

<Background />
<slot />
<Help />

<style>
	:global(body) {
		min-height: 100vh;
		margin: 0;
		font-family:
			Libre Baskerville,
			serif;
	}
	:global(*)::selection{
		background-color: #6baff0;
	}
</style>
