<script lang="ts">
	import { type TreeNode } from '$lib/filemanager';
	import MenuFile from './MenuFile.svelte';
    import MenuFolder from './MenuFolder.svelte';

	export let node: TreeNode;
    export let open = false;
</script>

<li>
    <details open={open}>
        <summary>
            {node.name}
        </summary>
        <ul>
            {#each node.children as child}
                {#if child.type === 'file'}
                    <MenuFile node={child} />
                {:else if child.type === 'folder'}
                    <MenuFolder node={child} />
                {/if}
            {/each}
        </ul>
    </details>
</li>
