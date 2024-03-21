<script lang="ts">
	import { FileManager, type TreeNode } from '$lib/filemanager';
	import MenuFile from './MenuFile.svelte';
    import MenuFolder from './MenuFolder.svelte';
	import Folder from '$lib/icons/Folder.svelte';
	import { isNodeJson } from '$lib/helper';

	export let node: TreeNode;
    export let open = false;
    export let folderContentLoaded = false;
    export let filemanager: FileManager;

    $: children = node.children;

    $: if (open && !folderContentLoaded) {
        folderContentLoaded = true;
        if (node.type === 'folder' && node.handle instanceof FileSystemDirectoryHandle){
            filemanager.getFolderContent(node).then((content) => {
                if (!content) return;
                node.children = content;
            });
        }
    }
</script>

<li>
    <details bind:open={open}>
        <summary>
            <Folder class_name="w-4 h-4" />
            {node.name}
        </summary>
        <ul>
            {#each children as child}
                {#if child.type === 'file' && (isNodeJson(child))}
                    <MenuFile node={child} />
                {:else if child.type === 'folder'}
                    <MenuFolder node={child} filemanager={filemanager} />
                {/if}
            {/each}
        </ul>
    </details>
</li>
