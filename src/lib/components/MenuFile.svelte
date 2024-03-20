<script lang="ts">
	import { type TreeNode } from '$lib/filemanager';
	import { openFile, toDelete } from '$lib/stores';
	import File from '$lib/icons/File.svelte';
	import Image from '$lib/icons/Image.svelte';
	import Trash from '$lib/icons/Trash.svelte';
	import DocumentText from '$lib/icons/DocumentText.svelte';
	import { isNodeImage, isNodeJson, removeFileExtension } from '$lib/helper';

	export let node: TreeNode;

	let isHovered = false;

	const isImage = isNodeImage(node);
	const isJson = isNodeJson(node);

	$: selected = $openFile?.id === node.id;

	function selectFile() {
		openFile.set(node);
	}

	function deleteFile() {
		toDelete.set(node);
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
		{removeFileExtension(node.name)}
	</button>
	{#if isHovered}
		<button class="btn btn-square btn-sm absolute right-[2px] top-[2px]" on:click={deleteFile}>
			<Trash class_name="w-4 h-4" />
		</button>
	{/if}
</li>
