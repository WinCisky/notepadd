<script lang="ts">
	import { set } from 'idb-keyval';
	import { openFile, openFilePath, rootDirectory, toDelete } from '$lib/stores';
	import File from '$lib/icons/File.svelte';
	import Image from '$lib/icons/Image.svelte';
	import Trash from '$lib/icons/Trash.svelte';
	import DocumentText from '$lib/icons/DocumentText.svelte';
	import { isFileImage, isFileJson, removeFileExtension } from '$lib/helper';

	export let fileHandle: FileSystemFileHandle;

	let isHovered = false;
	let selected = false;

	const isImage = isFileImage(fileHandle);
	const isJson = isFileJson(fileHandle);

	$: $openFile?.isSameEntry(fileHandle).then((same) => {
		selected = same;
	});

	async function selectFile() {
		openFile.set(fileHandle);
		const path = await $rootDirectory?.resolve(fileHandle);
		if (path) {
			openFilePath.set(path);
			await set('openFilePath', path);
		}
	}

	function deleteFile() {
		toDelete.set(fileHandle);
	}
</script>

<li on:mouseenter={() => (isHovered = true)} on:mouseleave={() => (isHovered = false)}>
	<button class={selected ? 'active' : ''} on:click={selectFile}>
		{#if isImage}
			<Image />
		{:else if isJson}
			<DocumentText class_name="w-4 h-4" />
		{:else}
			<File />
		{/if}
		{removeFileExtension(fileHandle.name)}
	</button>
	{#if isHovered}
		<button class="btn btn-square btn-sm absolute right-[2px] top-[2px]" on:click={deleteFile}>
			<Trash class_name="w-4 h-4" />
		</button>
	{/if}
</li>
