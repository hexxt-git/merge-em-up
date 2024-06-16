<script lang="ts">
	let state: 'visible' | 'hidden' = 'hidden';
	let toggle_state = () => {
		if (state == 'visible') state = 'hidden';
		else state = 'visible';
	};
</script>

{#if state == 'visible'}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		id="help-page"
		on:click={(e) => {
			//@ts-ignore
			if (e.target.id == 'help-page') state = 'hidden';
		}}
	>
		<div id="help-content">
			<h1>help:</h1>
			<p>
				there is no final goal or target you must achieve. <br />
				you can merge cards by dragging them on top of each other and
				duplicate them by double clicking. <br />
				you can also add new cards using the text input above.
			</p>
		</div>
	</div>
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<button id="help-toggle" on:click={toggle_state}> ? </button>

<style>
	#help-page {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	#help-content {
		background-color: #fffffff0;
		border: solid #222 1px;
		border-radius: 20px;
		padding: 40px 20px 80px 20px;
		animation: appear 300ms ease-out;
		width: 550px;
		max-width: 80vw;
	}
	@keyframes appear {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	h1 {
		margin: 0 0 10px 0;
	}
	#help-toggle {
		position: absolute;
		bottom: 0;
		right: 0;
		margin: 30px;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fffe;
		border-radius: 100%;
		border: solid #222 1px;
		font-family: sans-serif;
		font-size: 20px;
		font-weight: 300;
		cursor: pointer;
	}
</style>
