<script lang="ts">
	import { base } from '$app/paths';
	import Notepad from '$lib/icons/Notepad.svelte';
	import Folder from '$lib/icons/Folder.svelte';
	import CreditCard from '$lib/icons/CreditCard.svelte';
	import Heart from '$lib/icons/Heart.svelte';
</script>

<svelte:head>
	<title>Notepadd</title>
	<meta name="description" content="Local file editor" />
</svelte:head>

<div class="hero min-h-screen bg-base-300">
	<div class="hero-content text-center">
		<div class="flex flex-col gap-6 max-w-lg">
			<div class="flex items-center justify-center gap-2">
				<h1 class="text-5xl font-bold">
					<a href="{base}/editor">
						Notepadd
					</a>
				</h1>
			</div>
		</div>
	</div>
</div>

<style>
	.hero {
		background-image: url('/favicon-white.svg');
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
	}
</style>
