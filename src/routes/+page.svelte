<script lang="ts">
    import { base } from "$app/paths";
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

<div class="px-6 py-10 flex flex-col gap-4 justify-center items-center w-full">
	<h1 class="text-3xl font-bold underline w-fit">Hello world!</h1>

	<a href="{base}/editor" class="btn w-fit">Go to Editor</a>
	<a href="{base}/test" class="btn w-fit">Go to Test</a>
</div>