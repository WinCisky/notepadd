<script lang="ts">
	import { type TreeNode } from '$lib/filemanager';
	import { openFile } from '$lib/stores';
	import File from '$lib/icons/File.svelte';
	import Image from '$lib/icons/Image.svelte';

	export let node: TreeNode;

	const isImage = node.type === 'file' && node.name.match(/\.(png|jpg|jpeg|gif|svg)$/i);

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
			<File />
		{/if}
		{node.name}
	</button>
</li>
