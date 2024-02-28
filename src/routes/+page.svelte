<script lang="ts">
	async function handleFiles() {
		try {
			// @ts-ignore
			const directoryHandle = await window.showDirectoryPicker();
			console.log('directoryHandle', directoryHandle);
		} catch (error) {
			console.error('Error opening directory', error);
		}
	}
</script>

<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>

<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>

<button class="btn" on:click={handleFiles}>Button</button>