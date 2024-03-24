<script lang="ts">
	import { FileManager, type TreeNode } from '$lib/filemanager';
	import MenuFile from './MenuFile.svelte';
    import MenuFolder from './MenuFolder.svelte';
	import Folder from '$lib/icons/Folder.svelte';
	import { isFileJson } from '$lib/helper';
    import { deletedFilePath, createdFilePath } from '$lib/stores';

    type FileSystemHandleUnion = FileSystemDirectoryHandle | FileSystemFileHandle;

    export let folderHandle: FileSystemDirectoryHandle;
    export let open = false;
    export let reloadFolder = false;

    let isFolderLoaded = false;
    let reloadSubFolders = false;
    let folderContent: FileSystemHandleUnion[] = [];

    $: if (open && !isFolderLoaded) {
        isFolderLoaded = true;
        loadFolder();
    }

    $: if (open && reloadFolder) {
        reloadFolder = false;
        if ($deletedFilePath) {
            if ($deletedFilePath.includes(folderHandle.name)) {
                // if tehre's the deleted file, set the deleted file path to null
                const deletedFile = $deletedFilePath[$deletedFilePath.length - 1];
                for (const entry of folderContent) {
                    if (entry.name === deletedFile) {
                        deletedFilePath.set(null);
                        break;
                    }
                }
                loadFolder();
            }
        }
        if ($createdFilePath) {
            if ($createdFilePath.includes(folderHandle.name)) {
                // if tehre's the created file, set the created file path to null
                const createdFile = $createdFilePath[$createdFilePath.length - 1];
                for (const entry of folderContent) {
                    if (entry.name === createdFile) {
                        createdFilePath.set(null);
                        break;
                    }
                }
                loadFolder();
            }
        }
        loadFolder();
    }

    $: sortedFolderContent = folderContent.sort((a, b) => {
        // Ordina per tipo (cartelle per prime)
        if (a.kind !== b.kind) {
            return a.kind === 'directory' ? -1 : 1;
        }
        // Se sono dello stesso tipo, ordina per nome
        return a.name.localeCompare(b.name);
    });

    async function loadFolder() {
        folderContent = [];
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
            {#each sortedFolderContent as entry}
                {#if entry.kind === 'directory' && entry instanceof FileSystemDirectoryHandle}
                    <MenuFolder folderHandle={entry} reloadFolder={reloadSubFolders} />
                {:else if entry.kind === 'file' && isFileJson(entry)}
                    <MenuFile fileHandle={entry} />
                {/if}
            {/each}
        </ul>
    </details>
</li>
