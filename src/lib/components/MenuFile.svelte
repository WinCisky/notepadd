<script lang="ts">
	import { type TreeNode } from '$lib/filemanager';
    import { selectedItemId } from '$lib/stores';

	export let node: TreeNode;

    $: selected = $selectedItemId === node.id;

    function selectFile() {
        selectedItemId.set(node.id);
    }
</script>

<li>
    <button class="{selected ? 'active' : ''}" on:click={selectFile}>
        {node.name}
    </button>
</li>
