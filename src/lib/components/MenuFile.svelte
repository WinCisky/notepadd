<script lang="ts">
	import { type TreeNode } from '$lib/filemanager';
	import { openFile } from '$lib/stores';

	export let node: TreeNode;

	$: selected = $openFile?.id === node.id;

	function selectFile() {
		openFile.set(node);
	}
</script>

<li>
	<button class={selected ? 'active' : ''} on:click={selectFile}>
		{node.name}
	</button>
</li>
