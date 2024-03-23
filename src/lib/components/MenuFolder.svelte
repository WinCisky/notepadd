<script lang="ts">
	import { FileManager, type TreeNode } from '$lib/filemanager';
	import MenuFile from './MenuFile.svelte';
    import MenuFolder from './MenuFolder.svelte';
	import Folder from '$lib/icons/Folder.svelte';

    type FileSystemHandleUnion = FileSystemDirectoryHandle | FileSystemFileHandle;

    export let folderHandle: FileSystemDirectoryHandle;
    export let open = false;

    let isFolderLoaded = false;
    let folderContent: FileSystemHandleUnion[] = [];

    $: if (open && !isFolderLoaded) {
        loadFolder();
    }

    async function loadFolder() {
        isFolderLoaded = true;
        for await (const entry of folderHandle.values()) {
            folderContent = [...folderContent, entry];
        }
    }
</script>

<li>
    <details bind:open={open}>
        <summary>
            <Folder class_name="w-4 h-4" />
            {folderHandle.name}
        </summary>
        <ul>
            {#each folderContent as entry}
                {#if entry.kind === 'directory' && entry instanceof FileSystemDirectoryHandle}
                    <MenuFolder folderHandle={entry} />
                {/if}
            {/each}
        </ul>
    </details>
</li>
