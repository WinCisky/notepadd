<script lang="ts">
	import { type TreeNode } from '$lib/filemanager';
	import { openFile } from '$lib/stores';
	import File from '$lib/icons/File.svelte';

	export let node: TreeNode;

	$: selected = $openFile?.id === node.id;

	function selectFile() {
		openFile.set(node);
	}
</script>

<li>
	<button class={selected ? 'active' : ''} on:click={selectFile}>
		<File />
		{node.name}
	</button>
</li>
