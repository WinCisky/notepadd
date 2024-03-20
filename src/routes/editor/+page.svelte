<script lang="ts">
	import md from 'markdown-it';
	import { onMount } from 'svelte';
	import { FileManager, type TreeNode } from '$lib/filemanager';
	import Notepad from '$lib/icons/Notepad.svelte';
	import FolderPlus from '$lib/icons/FolderPlus.svelte';
	import MenuFolder from '$lib/components/MenuFolder.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import DocumentPlus from '$lib/icons/DocumentPlus.svelte';
	import { openFile, rootDirectory, toDelete } from '$lib/stores';
	import EditorJs from '$lib/icons/EditorJs.svelte';
	import { removeFileExtension } from '$lib/helper';

	let filemanager = new FileManager();
	let renderedContent = '';
	let folderSelected = false;
	let isLoading = true;
	let fileTree: TreeNode | undefined;

	$: {
		if ($openFile) {
			openFileChange($openFile!);
		}
	}

	onMount(async () => {
		folderSelected = await filemanager.isFolderLoaded();

		if (folderSelected) {
			const hasPermission = await filemanager.hasPermission();
			if (!hasPermission) {
				const permission_modal = document.getElementById('permission_modal') as HTMLDialogElement;
				permission_modal.showModal();
			}
			await filemanager.getFoldersAndFiles();
			fileTree = filemanager.root;
			rootDirectory.set(filemanager.root);
		}
		isLoading = false;
	});

	async function askPermission() {
		isLoading = true;
		await filemanager.askPermission();
		const permission_modal = document.getElementById('permission_modal') as HTMLDialogElement;
		permission_modal.close();
		await filemanager.getFoldersAndFiles();
		fileTree = filemanager.root;
		isLoading = false;
	}

	async function openFolder() {
		folderSelected = await filemanager.openFolder();
		if (folderSelected) {
			await filemanager.getFoldersAndFiles();
			fileTree = filemanager.root;
		}
	}

	async function openFileChange(node: TreeNode) {
		if (node.type === 'file') {
			if (node.handle instanceof FileSystemFileHandle) {
				const file = await node.handle.getFile();
				const content = await file.text();
				if (file.name.endsWith('.md')) {
					renderedContent = md().render(content);
				} else {
					// TODO: handle other file types
					renderedContent = content;
				}
			}
		}
	}

	async function createNewFile() {
		const file = await filemanager.getNewFileHandle();
		if (file) {
			await filemanager.getFoldersAndFiles();
			fileTree = filemanager.root;
		}
	}

	function confirmFileDelete() {
		// TODO: delete file
		toDelete.set(null);
	}

	function cancelFileDelete() {
		toDelete.set(null);
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="github-markdown-light.css" />
</svelte:head>

<dialog id="permission_modal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">No local file access</h3>
		<p class="py-4">May I have your permission to access your local files?</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Cancel</button>
			</form>
			<button class="btn" on:click={askPermission}>Ok</button>
		</div>
	</div>
</dialog>

{#if $toDelete}
	<div role="alert" class="alert alert-warning absolute top-2 left-0 m-auto right-0 z-20 max-w-lg">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current shrink-0 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/></svg
		>
		<span>Warning: Delete file "{removeFileExtension($toDelete.name)}"?</span>
		<div>
			<button class="btn btn-sm" on:click={cancelFileDelete}>No</button>
			<button class="btn btn-sm" on:click={confirmFileDelete}>Yes</button>
		</div>
	</div>
{/if}

<div class="drawer min-h-screen bg-base-200 lg:drawer-open">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<main class="drawer-content">
		{#if $openFile}
			<EditorJs />
		{:else}
			<div class="flex items-center justify-center h-full">
				<div class="text-center">
					<h1 class="text-4xl font-bold">
						{#if new Date().getHours() < 12}
							Good morning.
						{:else if new Date().getHours() < 18}
							Good afternoon.
						{:else}
							Good evening.
						{/if}
					</h1>
					{#if !folderSelected}
						<button class="btn btn-outline mt-4" on:click={openFolder}>
							<FolderPlus />
							Select folder
						</button>
					{/if}
				</div>
			</div>
		{/if}
		{#if folderSelected}
			<button
				class="btn btn-circle btn-outline fixed right-8 bottom-8 z-10"
				on:click={createNewFile}
			>
				<DocumentPlus />
			</button>
		{/if}
	</main>
	<aside class="drawer-side z-10">
		<label for="my-drawer" class="drawer-overlay"></label>
		<!-- sidebar menu -->
		<nav
			class="flex min-h-screen min-w-72 w-fit flex-col gap-2 overflow-y-auto bg-base-100 px-6 py-10"
		>
			<div class="mx-4 flex items-center gap-2 font-black">
				<Notepad />
				Notepadd
			</div>
			{#if isLoading}
				<button class="btn skeleton mt-4"> Loading... </button>
			{:else if folderSelected}
				<ul class="menu">
					{#if fileTree}
						<MenuFolder node={fileTree} open={true} folderContentLoaded={true} {filemanager} />
					{:else}
						<li class="mt-4">No files found</li>
						<li class="mt-4">
							<button class="btn btn-sm btn-circle" on:click={createNewFile}>
								<Plus />
							</button>
						</li>
					{/if}
				</ul>
			{:else}
				<button class="btn btn-outline mt-4" on:click={openFolder}>
					<FolderPlus />
					Select folder
				</button>
			{/if}
		</nav>
		<!-- /sidebar menu -->
	</aside>
</div>
