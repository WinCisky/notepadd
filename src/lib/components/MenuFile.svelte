<script lang="ts">
	import { type TreeNode } from '$lib/filemanager';
	import { openFile } from '$lib/stores';
	import File from '$lib/icons/File.svelte';
	import Image from '$lib/icons/Image.svelte';
	import DocumentText from '$lib/icons/DocumentText.svelte';
	import { isNodeImage, isNodeJson, removeFileExtension } from '$lib/helper';

	export let node: TreeNode;

	const isImage = isNodeImage(node);
	const isJson = isNodeJson(node);

	$: selected = $openFile?.id === node.id;

	function selectFile() {
		openFile.set(node);
	}
</script>

<li>
	<button class={selected ? 'active' : ''} on:click={selectFile}>
		{#if isImage}
			<Image />
		{:else}
			{#if isJson}
				<DocumentText class_name="w-4 h-4" />
			{:else}
				<File />
			{/if}
		{/if}
		{removeFileExtension(node.name)}
	</button>
</li>
