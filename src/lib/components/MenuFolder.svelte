<script lang="ts">
	import MenuFile from './MenuFile.svelte';
	import MenuFolder from './MenuFolder.svelte';
	import Folder from '$lib/icons/Folder.svelte';
	import { isFileJson } from '$lib/helper';
	import { deletedFilePath, createdFilePath, openFilePath, rootDirectory } from '$lib/stores';

	type FileSystemHandleUnion = FileSystemDirectoryHandle | FileSystemFileHandle;

	export let folderHandle: FileSystemDirectoryHandle;
	export let open = false;
	export let reloadFolder = false;

	let isFolderLoaded = false;
	let reloadSubFolders = false;
	let folderContent: FileSystemHandleUnion[] = [];

	$: if ((open && !isFolderLoaded) || reloadFolder) {
		isFolderLoaded = true;
		reloadFolder = false;

		// set folder open if it's in the open file path
		if ($deletedFilePath && $deletedFilePath.includes(folderHandle.name)) {
			open = true;
		}
		// set folder open if it's in the created file path
		if ($createdFilePath && $createdFilePath.includes(folderHandle.name)) {
			open = true;
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

	function isSubFolderOpen(entry: FileSystemDirectoryHandle) {
		if (!$openFilePath) return false;
		if (folderHandle === $rootDirectory) return true;
		// get current folder index from open file path
		const folderIndex = $openFilePath.indexOf(folderHandle.name);
		if (folderIndex === -1) return false;
		if ($openFilePath.length < 2 || folderIndex === $openFilePath.length - 2) return true;
		// get name of the next index
		const nextFolder = $openFilePath[folderIndex + 1];
		return nextFolder === entry.name;
	}
</script>

<li>
	<details bind:open>
		<summary>
			<Folder class_name="w-4 h-4" />
			{folderHandle.name}
		</summary>
		<ul>
			{#each sortedFolderContent as entry}
				{#if entry.kind === 'directory' && entry instanceof FileSystemDirectoryHandle}
					<MenuFolder
						folderHandle={entry}
						bind:reloadFolder={reloadSubFolders}
						open={isSubFolderOpen(entry)}
					/>
				{:else if entry.kind === 'file' && isFileJson(entry)}
					<MenuFile fileHandle={entry} />
				{/if}
			{/each}
		</ul>
	</details>
</li>
